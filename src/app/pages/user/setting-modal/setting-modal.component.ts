import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styleUrls: ['./setting-modal.component.less']
})
export class SettingModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  loading = false;

  changeVisible(visible: boolean) {
    this.visibleChange.emit(visible);
  }
}
