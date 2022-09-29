#!/bin/bash
# orange='\033[0;33m'
# green='\033[0;32m'
# NC='\033[0m'
# & means both standard output (1>) and standard error(2>).
# redirect both stdout and stderr to file /dev/null
# The symbol 2>&1 redirects both the standard output and the standard error to the standard output

# pkill <<< pgrep "docker" | tr '\n' ' ' &> /dev/null
# pkill <<< pgrep "Docker Desktop" | tr '\n' ' ' &> /dev/null

# echo "y" | sh init_docker.sh &
# do_script=$!
# wait $do_script

# docker=1
# while [ $docker -eq "1" ]
# do
#     docker ps &> /dev/null # 2>&1
#     docker=$?
#     echo "${orange}waiting for docker daemon ...${NC}"
#     sleep 2
# done
# echo "${green}docker daemon is installed${NC}"

# # -------------------------------------------------------------------------------

# install images and run containers using docker compose 
echo "${orange}install postgres${NC}"
docker compose up postgres -d


# optional 
echo "${orange}install pgadmin${NC}"
docker compose up pgadmin -d 

# -------------------------------------------------------------------------------
# install dependencies required to run my server
# path where package.json is located


cd ..
npm install -f 
npx prisma migrate dev
npm run start:dev