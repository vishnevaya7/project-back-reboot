const {Client} = require('pg');

async function testDatabase() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'dev',
        user: 'postgres',
        password: 'postgres',
    });

    try {
        console.log('🔌 Подключение к базе данных...');
        await client.connect();
        console.log('✅ Подключение успешно!');

        // Проверяем существование схемы store
        console.log('\n📋 Проверка схемы store...');
        const schemaResult = await client.query(`
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name = 'store'
        `);

        if (schemaResult.rows.length > 0) {
            console.log('✅ Схема store существует');
        } else {
            console.log('❌ Схема store не найдена');
            return;
        }

        // Проверяем структуру таблицы product
        console.log('\n📋 Проверка структуры таблицы product...');
        const tableResult = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'store'
              AND table_name = 'product'
            ORDER BY ordinal_position
        `);

        if (tableResult.rows.length > 0) {
            console.log('✅ Таблица product найдена:');
            tableResult.rows.forEach(row => {
                console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
            });
        } else {
            console.log('❌ Таблица product не найдена');
        }

        // Проверяем данные в таблице product
        console.log('\n📋 Проверка данных в таблице product...');
        const dataResult = await client.query('SELECT COUNT(*) as count FROM store.product');
        console.log(`📊 Количество продуктов: ${dataResult.rows[0].count}`);

        // Проверяем таблицу миграций Liquibase
        console.log('\n📋 Проверка миграций Liquibase...');
        const migrationResult = await client.query(`
            SELECT id, filename, dateexecuted
            FROM public.databasechangelog
            ORDER BY dateexecuted DESC LIMIT 10
        `);

        if (migrationResult.rows.length > 0) {
            console.log('✅ Найдены выполненные миграции:');
            migrationResult.rows.forEach(row => {
                console.log(`   - ${row.id}: ${row.filename} (${row.dateexecuted})`);
            });
        } else {
            console.log('❌ Миграции Liquibase не найдены');
        }

    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await client.end();
    }
}

testDatabase();
