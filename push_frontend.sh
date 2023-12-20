#!/bin/bash
set -e

if [ $# -ne 1 ]; then 
    echo "Usage: $0 <aws_account_id>"
    exit 1
fi

aws_account_id=$1
docker tag dwarf-frontend:latest $aws_account_id.dkr.ecr.us-east-2.amazonaws.com/dwarf-frontend:latest
docker push $aws_account_id.dkr.ecr.us-east-2.amazonaws.com/dwarf-frontend:latest
