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

if ! command -v docker >/dev/null 2>&1; then
	echo "${bold}${red}Docker not installed. Please install docker and then run this script again...${normal}"
elif ! command -v node >/dev/null 2>&1; then
    echo "${bold}${red}Node not installed. Please install Node and then run this script again...${normal}"
else
    echo "${bold}Building service, setting up database, and spinning up the application. Get some coffee, this may take a while...${normal}"
    sh build-and-run.sh >/dev/null 2>&1 & pid=$!
    loader $pid

    echo "${bold}Populating dummy data..."
    sh db-migration.sh

    sh verify_app_running.sh
fi
