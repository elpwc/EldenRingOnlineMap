from ctypes import resize
import os
import math
from PIL import Image


def overlap(box1, box2):
    minx1, miny1, maxx1, maxy1 = box1
    minx2, miny2, maxx2, maxy2 = box2
    minx = max(minx1, minx2)
    miny = max(miny1, miny2)
    maxx = min(maxx1, maxx2)
    maxy = min(maxy1, maxy2)
    if minx > maxx or miny > maxy:
        return False
    else:
        return True


img = Image.open('./underground.jpg')
print(img.size)

# 基准点：1085, 2987
# 计算后的全图左上角：1240-6400, 2987-6400 => -5160, -3413
# 计算后的全图长宽：12800, 12800
# 原图长宽：5235, 3278

# 开始级别
minLevel = 7

# 目标级别
maxLevel = 2

# 目标图块大小
resW = 200
resH = 200

# 结果文件夹
resultFolder = 'map'

# 开始
for level in range(minLevel, maxLevel-1, -1):
    print('level: '+str(level))

    # 当前缩放系数
    resizeK = (2 ** (level - 7))

    # 缩放
    img = img.resize((math.ceil(5235 * resizeK),  math.ceil(3278 * resizeK)))

    # 当前原图长宽
    currentW = img.size[0]
    currentH = img.size[1]

    # 当前左上角坐标
    currentLeft = math.ceil(-5160 * resizeK)
    currentTop = math.ceil(-3413 * resizeK)

    # 当前总图长宽
    currentAllW = math.ceil(12800 * resizeK)
    currentAllH = math.ceil(12800 * resizeK)

    # 左上角的图块的XY编号，每次以2的指数递减
    currentX = 2 ** (level - 2)
    currentY = 2 ** (level - 1)

    # 当前图块编号最大值
    currentXCount = math.ceil(currentAllW / 200)
    currentYCount = math.ceil(currentAllH / 200)

    # 开切！
    for X in range(currentX, currentXCount + currentX):
        for Y in range(currentY, currentYCount + currentY):
            cutX = currentLeft + (X - currentX) * resW
            cutY = currentTop + (Y - currentY) * resH

            # 如果有重叠再切
            if(overlap((0, 0, currentW, currentH), (cutX, cutY, cutX + resW, cutY+resH))):
                # 建立文件夹
                if (not os.path.exists("./{resultFolder}/{level}/".format(resultFolder=resultFolder, level=level) + str(X))):
                    os.makedirs(
                        "./{resultFolder}/{level}/".format(resultFolder=resultFolder, level=level) + str(X))

                # 切！
                res = Image.new('RGB', (resW, resH), (34, 34, 34))
                res.paste(img, (-cutX, -cutY))

                # res = img.crop((cutX, cutY, cutX + resW, cutY + resH))
                # 存！
                res.save("./{resultFolder}/{level}/{X}/{Y}.jpg".format(
                    resultFolder=resultFolder, level=level, X=X, Y=Y))
