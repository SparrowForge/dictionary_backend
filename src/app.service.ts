import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { PasswordResetToken } from './auth/entities/password-reset-token.entity';
import { User } from './users/entities/user.entity';
import { AuditLog } from './audits/entities/audit.entity';
import { Teacher } from './teacher/entities/teacher.entity';
import { Classes } from './classes/entities/classes.entity';
import { Students } from './students/entities/students.entity';
import { Files } from './files/entities/file.entity';
import { FileReference } from './files/entities/file-reference.entity';
import { Words } from './words/entities/words.entity';
import { WordClasses } from './word-classes/entities/word-classes.entity';
import { WordSynonyms } from './word-synonyms/entities/word-synonyms.entity';
import { WordAntonyms } from './word-antonyms/entities/word-antonyms.entity';
import { WordForms } from './word-forms/entities/word-forms.entity';
import { WordSentences } from './word-sentences/entities/word-sentences.entity';
import { WordMedia } from './word-media/entities/word-media.entity';

@Injectable()

export class AppService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [
        AuditLog,
        RefreshToken,
        PasswordResetToken,
        User,
        Files,
        FileReference,
        Teacher,
        Classes,
        Students,
        Words,
        WordClasses,
        WordSynonyms,
        WordAntonyms,
        WordForms,
        WordSentences,
        WordMedia
      ],
      synchronize: false, // Never use synchronize in production
      logging: isDevelopment,
      migrations: isDevelopment ? [] : ['dist/migrations/*.js'],
      migrationsRun: !isDevelopment,
      migrationsTableName: 'migrations',
      // Connection pool settings
      extra: {
        max: 20, // Maximum number of connections in the pool
        min: 5, // Minimum number of connections in the pool
        acquire: 60000, // Maximum time (ms) that pool will try to get connection before throwing error
        idle: 10000, // Maximum time (ms) that a connection can be idle before being released
      },
      // SSL configuration - controlled by environment variable
      ssl:
        this.configService.get('DB_SSL_ENABLED') === 'true'
          ? {
            rejectUnauthorized: false,
          }
          : false,
      // Retry configuration
      retryAttempts: 10,
      retryDelay: 3000,
    };
  }
}

