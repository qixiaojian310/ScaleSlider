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


class ScaleSliderController(BaseModel):
    scales: List[Scale]
    min: Scale
    max: Scale
    key: str


# 创建一个包含 scaleSliders 数据的变量
# TODO 需要新的数据和刻度
scale_sliders = [
    {
        "scales": [
            {"value": 10, "label": "One", "key": "1"},
            {"value": 20, "label": "Two", "key": "2"},
            {"value": 30, "label": "Three", "key": "3"},
        ],
        "min": {"value": 0, "label": "Zero", "key": "min"},
        "max": {"value": 150, "label": "Max", "key": "max"},
        "key": "slide1",
    },
    {
        "scales": [
            {"value": 10, "label": "Low", "key": "1"},
            {"value": 70, "label": "Mid", "key": "2"},
            {"value": 90, "label": "High", "key": "3"},
        ],
        "min": {"value": 0, "label": "Min", "key": "min"},
        "max": {"value": 120, "label": "Max", "key": "max"},
        "key": "slide2",
    },
]


# 创建一个新的 GET 路由来返回 scaleSliders 数据
@app.get("/slide/data", response_model=List[ScaleSliderController])
async def get_scale_sliders():
    return scale_sliders


@app.post("/slide/res")
async def calculate_sum(scales: List[Scale]):
    # 计算value的总和
    # TODO 需要新的求和逻辑
    concatenated_labels = "".join(scale.label for scale in scales)
    # 返回结果
    return {"result": str(concatenated_labels)}
