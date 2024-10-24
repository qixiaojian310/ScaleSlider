from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# 挂载静态文件目录
app.mount("/dist", StaticFiles(directory="dist"), name="dist")


# 创建根路径，返回 HTML 文件
@app.get("/", response_class=HTMLResponse)
async def read_index():
    # 读取并返回 index.html 文件的内容
    with open("dist/index.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)
