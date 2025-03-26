# 虚拟列表

## 基本原理

- 计算可视区域最多容纳的list数量(maxCount)
- 滚动列表容器，当列表中第一个元素滚出滚动容器时，在列表中添加padding（值为每个元素的高度），将当前元素挤下去，并重新计算列表中展示的元素（startIndex = scrollTop / itemHeight  ,  endIndex = startIndex + maxCount）
- 循环上述操作

