import { Component } from '../Component';

export class Sprite extends Component {
  public image: HTMLImageElement | null = null;
  public width: number;
  public height: number;
  public offsetX: number;
  public offsetY: number;
  public visible: boolean;
  public tint: string;

  constructor(
    imageSrc?: string,
    width = 16,
    height = 16,
    offsetX = 0,
    offsetY = 0
  ) {
    super();
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.visible = true;
    this.tint = 'white';

    if (imageSrc) {
      this.loadImage(imageSrc);
    }
  }

  private loadImage(src: string) {
    this.image = new Image();
    this.image.src = src;
  }
}