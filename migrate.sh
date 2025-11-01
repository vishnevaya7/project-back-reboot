#!/bin/bash

# Скрипт для управления миграциями Liquibase

case "$1" in
  "update")
    echo "Применение миграций..."
    docker-compose --profile migration run --rm liquibase update
    ;;
  "status")
    echo "Статус миграций..."
    docker-compose --profile migration run --rm liquibase status --verbose
    ;;
  "rollback")
    if [ -z "$2" ]; then
      echo "Использование: ./migrate.sh rollback <tag>"
      exit 1
    fi
    echo "Откат к тегу: $2"
    docker-compose --profile migration run --rm liquibase rollback $2
    ;;
  "validate")
    echo "Валидация changelog..."
    docker-compose --profile migration run --rm liquibase validate
    ;;
  "history")
    echo "История миграций..."
    docker-compose --profile migration run --rm liquibase history
    ;;
  *)
    echo "Использование: ./migrate.sh {update|status|rollback <tag>|validate|history}"
    echo ""
    echo "Команды:"
    echo "  update    - Применить все новые миграции"
    echo "  status    - Показать статус миграций"
    echo "  rollback  - Откатить к указанному тегу"
    echo "  validate  - Проверить корректность changelog"
    echo "  history   - Показать историю миграций"
    exit 1
    ;;
esac
