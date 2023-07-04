
@echo off
docker build -t hiportal .

REM Nom du conteneur Docker à vérifier
set container_name=hiportal

REM Vérifier si le conteneur est présent
set container_present=null
for /f "delims=" %%i in ('docker ps --format "%container_name%"') do (
    if /i "%%i"=="%container_name%" (
        set "container_present=true"
        @REM exit /b
    )
)
REM Vérifier le statut du conteneur
if "%container_present%"=="true" (
    echo Le conteneur %container_name% est présent.
    echo Arrêt du conteneur %container_name%...
    docker kill %container_name%
    echo Suppression du conteneur %container_name%...
    docker rm %container_name%
) else (
    echo Le conteneur %container_name% n'est pas présent.
    echo Démarrage du conteneur %container_name%...
)
docker run -dit -p 4000:4000 --name hiportal -e "HIPORTAL_PASSWORD=" -e "HIPORTAL_EMAIL=" hiportal 
docker logs -f %container_name%
