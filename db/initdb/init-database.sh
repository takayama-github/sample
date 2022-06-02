#!/bin/bash

for sqlfile in $( ls /docker-entrypoint-initdb.d/sql/ ); do
    if [[ $sqlfile =~ ^[0-9]{2}-.*\.sql$ ]] ;
    then
        echo "EXECUTE ${sqlfile}!!"
        psql -f /docker-entrypoint-initdb.d/sql/${sqlfile} -U ${POSTGRES_USER} -d ${POSTGRES_DB}
    fi
done
