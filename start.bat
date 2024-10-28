@echo off
cd scaleSliderBackend
start cmd /k "uvicorn main:app --reload --port 8000"

cd ..
cd scaleSliderPyDeploy
start cmd /k "uvicorn html:app --reload --port 5173"

echo Servers started on ports 8000 and 5173
