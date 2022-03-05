/**
 * 自定义地图图标
 * @description 导出的是生成图标数据的函数，用法：`L.divIcon(iconname(size, fontcolor)(title))`
 */
export const MapIcon = {
  default:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: white; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  cifu:
    (size: number = 20, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/fireicon.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  boss:
    (size: number = 30, fontcolor: string = 'yellow') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/boss.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  littleboss:
    (size: number = 28, fontcolor: string = 'yellow') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/littleboss.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  portal:
    (size: number = 24, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/portal.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  message:
    (size: number = 20, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/message.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  warning:
    (size: number = 15, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/warning.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  question:
    (size: number = 15, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/question.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  collect:
    (size: number = 20, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <img src="./resource/icons/collect.png" width="${size}px" height="${size}px"/>
        <p style="color: ${fontcolor};">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  white:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: white; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  yellow:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: #ffeb3b; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  green:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: #46ce46; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  blue:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: #38f; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  red:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: #ce1919; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
  purple:
    (size: number = 10, fontcolor: string = 'white') =>
    (title?: string) => {
      return {
        html: `
        <div class="icon">
        <div style="width:${size}px; height:${size}px; border-radius:${size}px; position: absolute; background-color: purple; box-shadow: 0 0 5px 0 black;"></div>
        <p style="color: ${fontcolor}; margin-left: ${size + 1}px">${title}</p>
        </div>
    `,
        className: '',
      };
    },
};
