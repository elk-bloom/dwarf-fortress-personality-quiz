#!/bin/bash
set -e

if [ $# -ne 3 ]; then 
    echo "Usage: $0 <aws_account_id> <aws_profile> <aws_region>"
    exit 1
fi

account_id="$1"
profile="$2"
region="$3"

aws ecr get-login-password --profile $profile | docker login --username AWS --password-stdin $account_id.dkr.ecr.$region.amazonaws.com