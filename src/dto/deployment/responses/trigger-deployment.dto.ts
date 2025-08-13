export class TriggerDeploymentDto {
  message: string;
  status: string;

  constructor({ message, status }: { message: string; status: string }) {
    this.message = message;
    this.status = status;
  }
}
