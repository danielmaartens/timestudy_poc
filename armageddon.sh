#!/usr/local/bin/bash

red=$(tput setaf 1)
white=$(tput setaf 7)
green=$(tput setaf 2)
blink=$(tput blink)
normal=$(tput sgr0)
bold=$(tput bold)
powder_blue=$(tput setaf 153)

loader(){
	MAX=10
	ARR=( $(eval echo {1..${MAX}}) )

	while kill -0 $1 2>/dev/null
	do
		for i in ${ARR[*]} ; do
		    printf "\e[2K[ "
				printf '▓%.0s' $(eval echo "{1..$i}")
		    printf "\e[%uC]" $((${MAX}+1-${i}))
		    printf "\r"
        if ! [ -z "$2" ]; then
				  sleep $2
				else
					sleep 0.1
				fi
		done
	done

	space=$(printf ' %.0s' $(eval echo "{1..$MAX}"))
	printf "${green}Done !${white} ${space} ${normal}\r\n\n"
}

removecontainers() {
    docker stop $(docker ps -aq)
    docker rm $(docker ps -aq)
}

remove_images_volumes() {
    docker rmi -f $(docker images --filter dangling=true -qa)
    docker volume rm $(docker volume ls --filter dangling=true -q)
    docker rmi -f $(docker images -qa)
}

armageddon() {

    echo "${bold}Removing all docker containers..${normal}"
    removecontainers >/dev/null 2>&1 & pid=$!
    loader $pid

    echo "${bold}Removing all docker networks...${normal}"
    docker network prune -f >/dev/null 2>&1 & pid=$!
    loader $pid

    echo "${bold}Removing all docker images and volumes..."${normal}
    remove_images_volumes >/dev/null 2>&1  & pid=$!
    loader $pid
}

armageddon