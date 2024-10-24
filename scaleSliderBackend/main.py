from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# 创建FastAPI实例
app = FastAPI()

# 允许跨域请求的来源
origins = ["http://localhost:5173"]

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 定义请求体的数据模型
class Scale(BaseModel):
    label: str
    value: float
    key: str


@app.post("/slide/res")
async def calculate_sum(scales: List[Scale]):
    # 计算value的总和
    concatenated_labels = "".join(scale.label for scale in scales)
    # 返回结果
    return {"result": str(concatenated_labels)}
