from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

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
    sliderKey: Optional[str]


class ScaleSliderController(BaseModel):
    scales: List[Scale]
    min: Scale
    max: Scale
    key: str
    label: str


# 创建一个包含 scaleSliders 数据的变量
# TODO 需要新的数据和刻度
scale_sliders: List[ScaleSliderController] = [
    {
        "scales": [
            {"value": 1000, "label": "Low", "key": "1"},
            {"value": 2000, "label": "Mid", "key": "2"},
            {"value": 3000, "label": "High", "key": "3"},
        ],
        "min": {"value": 1000, "label": "Zero", "key": "min"},
        "max": {"value": 3000, "label": "Max", "key": "max"},
        ###第一阶流水
        "label": "Total Flow Level 1",
        "key": "level1",
    },
    {
        "scales": [
            {"value": 0.1, "label": "Low", "key": "1"},
            {"value": 0.3, "label": "Mid", "key": "2"},
            {"value": 0.5, "label": "High", "key": "3"},
        ],
        "min": {"value": 0.1, "label": "Zero", "key": "min"},
        "max": {"value": 0.5, "label": "Max", "key": "max"},
        ###第一阶返回比例
        "label": "Cash Return Level 1",
        "key": "ratio1",
    },
    {
        "scales": [
            {"value": 10000, "label": "Low", "key": "1"},
            {"value": 20000, "label": "Mid", "key": "2"},
            {"value": 30000, "label": "High", "key": "3"},
        ],
        "min": {"value": 10000, "label": "Min", "key": "min"},
        "max": {"value": 30000, "label": "Max", "key": "max"},
        ###第二阶流水
        "label": "Total Flow Level 2",
        "key": "level2",
    },
    {
        "scales": [
            {"value": 0.1, "label": "Low", "key": "1"},
            {"value": 0.3, "label": "Mid", "key": "2"},
            {"value": 0.5, "label": "High", "key": "3"},
        ],
        "min": {"value": 0.1, "label": "Zero", "key": "min"},
        "max": {"value": 0.5, "label": "Max", "key": "max"},
        ###第一阶返回比例
        "label": "Cash Return Level 2",
        "key": "ratio2",
    },
]

##level distribution是level 1 和level 2的预计用户量
level_distribution = [150, 50]


# 查找 key 为 "level1" 的对象并返回其 value
def find_value_by_key(scales: List[Scale], target_key: str) -> Optional[float]:
    scale = next((s for s in scales if s.sliderKey == target_key), None)
    return scale.value if scale else None


# 创建一个新的 GET 路由来返回 scaleSliders 数据
@app.get("/slide/data")
async def get_scale_sliders():
    return scale_sliders


@app.post("/slide/res")
async def calculate_sum(scales: List[Scale]):
    # 计算value的总和
    # 计算返回的策略
    level_distribution_new = np.array(level_distribution) / np.sum(level_distribution)
    print(level_distribution)
    print("===")
    print(scales)
    ##xiaojian: 把这里改一下
    total_flow = level_distribution_new[0] * find_value_by_key(
        scales, "level1"
    ) + level_distribution_new[1] * find_value_by_key(scales, "level2")
    total_rtp_cost = (
        find_value_by_key(scales, "level1") * find_value_by_key(scales, "ratio1")
        + (find_value_by_key(scales, "level2") - find_value_by_key(scales, "level2"))
        * find_value_by_key(scales, "ratio2")
    ) / total_flow

    # 返回结果
    return {"result": str(total_rtp_cost)}
