import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
    selector: 'child',
    templateUrl: './child.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
    @Input() childName?: string;
}
