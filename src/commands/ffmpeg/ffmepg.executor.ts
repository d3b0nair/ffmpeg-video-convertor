import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor";
import { FileService } from "../../core/file/file.service";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { StreamHandler } from "../../core/handlers/stream.handler";
import { PromptService } from "../../core/prompt/prompt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
  private fileService: FileService = new FileService();
  private promtService: PromptService = new PromptService();

  constructor(logger: IStreamLogger) {
    super(logger);
  }
  protected async promt(): Promise<IFfmpegInput> {
    const width = await this.promtService.input<number>("Width:", "number");
    const height = await this.promtService.input<number>("Height:", "number");
    const path = await this.promtService.input<string>("Path to file:", "input");
    const name = await this.promtService.input<string>("File name:", "input");
    return { width, height, path, name };
  }
  protected build({
    width,
    height,
    path,
    name,
  }: IFfmpegInput): ICommandExecFfmpeg {
    const output = this.fileService.getFilePath(path, name, "mp4");
    const args = (new FfmpegBuilder)
      .input(path)
      .setVideoSize(width, height)
      .output(output);
    return { command: "ffmpeg", args, output };
  }
  protected spawn({
    output,
    command,
    args,
  }: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
    this.fileService.deleteFileIFExists(output);
    return spawn(command, args);
  }
  protected processStream(
    stream: ChildProcessWithoutNullStreams,
    logger: IStreamLogger
  ): void {
    const handler = new StreamHandler(logger);
    handler.processOutput(stream);
  }
}
