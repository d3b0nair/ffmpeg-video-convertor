export class FfmpegBuilder {
  private intputPath: string;
  private options: Map<string, string> = new Map();

  constructor() {
    this.options.set("-c:v", "libx264");
  }

  input(intputPath: string): this {
    this.intputPath = intputPath;
    return this;
  }

  setVideoSize(width: number, height: number): this {
    this.options.set("-s", `${width}x${height}`);
    return this;
  }

  output(outputPath: string): string[] {
    if (!this.intputPath) {
      throw new Error("Missing input parameter.");
    }
    const args: string[] = ["-i", this.intputPath];
    this.options.forEach((val, key) => {
      args.push(key);
      args.push(val);
    });
    args.push(outputPath);
    return args;
  }
}
