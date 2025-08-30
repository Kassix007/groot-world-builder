import { Component } from '../Component';

export interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
}

export class Animation extends Component {
  public clips: Map<string, AnimationClip> = new Map();
  public currentClip: string | null = null;
  public currentFrame = 0;
  public frameTime = 0;
  public playing = false;

  public addClip(clip: AnimationClip) {
    this.clips.set(clip.name, clip);
  }

  public play(clipName: string, restart = false) {
    if (this.currentClip === clipName && !restart) return;
    
    const clip = this.clips.get(clipName);
    if (!clip) {
      console.warn(`Animation clip '${clipName}' not found`);
      return;
    }

    this.currentClip = clipName;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.playing = true;
  }

  public stop() {
    this.playing = false;
    this.currentFrame = 0;
    this.frameTime = 0;
  }

  public getCurrentFrame(): AnimationFrame | null {
    if (!this.currentClip) return null;
    
    const clip = this.clips.get(this.currentClip);
    if (!clip || clip.frames.length === 0) return null;
    
    return clip.frames[this.currentFrame];
  }
}