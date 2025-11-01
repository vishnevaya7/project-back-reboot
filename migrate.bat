@echo off
REM Скрипт для управления миграциями Liquibase на Windows

if "%1"=="update" (
    echo Применение миграций...
    docker-compose --profile migration run --rm liquibase update
    goto :eof
)

if "%1"=="status" (
    echo Статус миграций...
    docker-compose --profile migration run --rm liquibase status --verbose
    goto :eof
)

if "%1"=="rollback" (
    if "%2"=="" (
        echo Использование: migrate.bat rollback ^<tag^>
        exit /b 1
    )
    echo Откат к тегу: %2
    docker-compose --profile migration run --rm liquibase rollback %2
    goto :eof
)

if "%1"=="validate" (
    echo Валидация changelog...
    docker-compose --profile migration run --rm liquibase validate
    goto :eof
)

if "%1"=="history" (
    echo История миграций...
    docker-compose --profile migration run --rm liquibase history
    goto :eof
)

echo Использование: migrate.bat {update^|status^|rollback ^<tag^>^|validate^|history}
echo.
echo Команды:
echo   update    - Применить все новые миграции
echo   status    - Показать статус миграций
echo   rollback  - Откатить к указанному тегу
echo   validate  - Проверить корректность changelog
echo   history   - Показать историю миграций
