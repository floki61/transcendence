import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoGuard extends AuthGuard('42') {
  constructor() {
    super();
  }
}
@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super ();
  }
}