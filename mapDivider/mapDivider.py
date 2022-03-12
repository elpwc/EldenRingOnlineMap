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


# 概念说明：
# 基准点：全图的4张图块的中心点在原图上的坐标
# 原图：拼接好的地图
# 全图：在缩放级别为 2 (最大)时，容纳原图的所有图块组成的图

def get_divided_maps(imageFileName, completeLeft, completeTop, resultFolder, currentXCalculator, currentYCalculator):

    img = Image.open(imageFileName)
    print(img.size)

    originalSize = img.size

    # 开始级别
    minLevel = 7

    # 目标级别
    maxLevel = 2

    # 目标图块大小
    resW = 200
    resH = 200

    # 开始
    for level in range(minLevel, maxLevel-1, -1):
        print('level: '+str(level))

        # 当前缩放系数
        resizeK = (2 ** (level - 7))

        # 缩放
        img = img.resize(
            (math.ceil(originalSize[0] * resizeK),  math.ceil(originalSize[1] * resizeK)))

        # 当前原图长宽
        currentW = img.size[0]
        currentH = img.size[1]

        # 当前左上角坐标
        currentLeft = math.ceil(completeLeft * resizeK)
        currentTop = math.ceil(completeTop * resizeK)

        # 当前总图长宽
        currentAllW = math.ceil(12800 * resizeK)
        currentAllH = math.ceil(12800 * resizeK)

        # 左上角的图块的XY编号，每次以2的指数递减
        currentX = currentXCalculator(level)
        currentY = currentYCalculator(level)

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
# 基准点：1085, 2987
# 计算后的全图左上角：1240-6400, 2987-6400 => -5160, -3413
# 计算后的全图长宽：12800, 12800
# 原图长宽：5235, 3278


def currentXCalculator_1(level):
    return 2 ** (level - 2)


def currentYCalculator_1(level):
    return 2 ** (level - 1)

# 基准点：2461, 2032
# 计算后的全图左上角：2461-6400, 2032-6400 => -3939, -4368
# 计算后的全图长宽：12800, 12800
# 原图长宽：5235, 3278


def currentXCalculator_2(level):
    return 0


def currentYCalculator_2(level):
    return 2 ** (level - 2)


if __name__ == "__main__":
    # 希芙拉河
    '''
    get_divided_maps(
        './underground.jpg',
        -5160, -3412, 'map',
        currentXCalculator_1,
        currentYCalculator_1
    )
    '''

    # 安瑟尔河
    get_divided_maps(
        './underground2.jpg',
        -4039, -4458, 'map2',
        currentXCalculator_2,
        currentYCalculator_2
    )
