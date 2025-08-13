import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ApiConfigService } from '@shared/config.service';
import { TriggerDeploymentDto } from '@dto/trigger-deployment.dto';
import { MisconfigurationException } from '@exceptions/misconfiguration.exception';

@Injectable()
export class ControlService {
  private readonly execAsync = promisify(exec);

  constructor(private readonly configService: ApiConfigService) {}

  getHealthCheck() {
    return { message: 'success' };
  }

  async triggerDeployment(): Promise<TriggerDeploymentDto> {
    const { sshUser, serverIp, sshPrivateKey } =
      this.configService.deploymentCredentials;

    if (!sshUser || !serverIp || !sshPrivateKey) {
      throw new MisconfigurationException();
    }

    // Create a temporary SSH key file
    const tempDir = os.tmpdir();
    const keyFileName = `deployment_key_${Date.now()}`;
    const keyFilePath = path.join(tempDir, keyFileName);

    // Write the private key to temporary file
    await fs.promises.writeFile(keyFilePath, sshPrivateKey, { mode: 0o600 });

    try {
      // Execute SSH command to trigger deployment
      const sshCommand = `ssh -o StrictHostKeyChecking=no -i "${keyFilePath}" ${sshUser}@${serverIp}`;

      await this.execAsync(sshCommand);

      return new TriggerDeploymentDto({
        message: 'Deployment triggered successfully',
        status: 'success'
      });
    } finally {
      // Clean up temporary key file
      try {
        await fs.promises.unlink(keyFilePath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temporary SSH key file:', cleanupError);
      }
    }
  }
}
