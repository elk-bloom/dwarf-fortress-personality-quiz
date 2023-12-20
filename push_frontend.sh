
#!/bin/bash
set -e

if [ $# -ne 2 ]; then 
    echo "Usage: $0 <aws_account_id> <aws_profile>"
    exit 1
fi


# push new image
aws_account_id="$1"
docker tag dwarf-frontend:latest $aws_account_id.dkr.ecr.us-east-2.amazonaws.com/dwarf-frontend:latest
docker push $aws_account_id.dkr.ecr.us-east-2.amazonaws.com/dwarf-frontend:latest

# force new deployment
profile="$2"
aws ecs --profile $profile update-service --cluster dwarf-cluster --service dwarf-frontend-service --force-new-deployment
