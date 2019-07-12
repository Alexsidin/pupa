import { Component, Input } from '@angular/core';
var ButtonComponent = (function () {
    function ButtonComponent() {
        this.type = 'solid';
        this.size = 'medium';
        this.color = 'normal';
    }
    ButtonComponent.prototype.getResultClassList = function (prefix) {
        return [this.type, this.size, this.color].map((function (innerProperty) { return "" + prefix + innerProperty; }));
    };
    ButtonComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pupa-button',
                    template: "<button class=\"button\" [ngClass]=\"getResultClassList('button_')\">\n  <span class=\"button__text\">\n    <ng-content></ng-content>\n  </span>\n</button>\n",
                    styles: [".button{box-sizing:border-box;font-family:effra;cursor:pointer;padding:0;outline:0;transition:background .3s cubic-bezier(.165,.84,.44,1);display:inline-flex;flex-direction:row;align-items:center;justify-content:space-evenly;flex-wrap:nowrap}.button__text{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.button_large{min-width:7rem;height:2.5rem;border-radius:1rem;padding:.625rem .8125rem}.button_large .button__text{font-size:1rem;font-weight:500;line-height:1}.button_medium{min-width:7rem;height:2rem;border-radius:.875rem;padding:.375rem 1rem}.button_medium .button__text{font-size:1rem;font-weight:500;line-height:1}.button_small{min-width:4rem;height:1.5rem;border-radius:.5rem;padding:.1875rem .625rem}.button_small .button__text{font-size:.875rem;font-weight:400;line-height:1.14}.button_solid.button_normal{border:none;background:#0a0d65}.button_solid.button_normal .button__text{color:#fff}.button_solid.button_normal:hover{border:none;background:#161ba6}.button_solid.button_normal:hover .button__text{color:#fff}.button_solid.button_negative{border:none;background:red}.button_solid.button_negative .button__text{color:#fff}.button_solid.button_positive{border:none;background:#00c902}.button_solid.button_positive .button__text{color:#fff}.button_solid.button_alert{border:none;background:#ffc009}.button_solid.button_alert .button__text{color:#fff}.button_outlined.button_normal{border:.0625rem solid #0a0d65;background:#fff}.button_outlined.button_normal .button__text{color:#0a0d65}.button_outlined.button_normal:hover{border:.0625rem solid #161ba6;background:#fff}.button_outlined.button_normal:hover .button__text{color:#161ba6}.button_outlined.button_negative{border:.0625rem solid red;background:#fff}.button_outlined.button_negative .button__text{color:#202020}.button_outlined.button_positive{border:.0625rem solid #00c902;background:#fff}.button_outlined.button_positive .button__text{color:#202020}.button_outlined.button_alert{border:.0625rem solid #ffc009;background:#fff}.button_outlined.button_alert .button__text{color:#202020}.button_link{border:none;background:#fff}.button_link .button__text{color:#0a0d65}"]
                }] }
    ];
    ButtonComponent.propDecorators = {
        type: [{ type: Input }],
        size: [{ type: Input }],
        color: [{ type: Input }]
    };
    return ButtonComponent;
}());
export { ButtonComponent };
if (false) {
    ButtonComponent.prototype.type;
    ButtonComponent.prototype.size;
    ButtonComponent.prototype.color;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUtqRDtJQUFBO1FBTWtCLFNBQUksR0FBZSxPQUFPLENBQUM7UUFDM0IsU0FBSSxHQUFlLFFBQVEsQ0FBQztRQUM1QixVQUFLLEdBQWdCLFFBQVEsQ0FBQztJQUtoRCxDQUFDO0lBSFEsNENBQWtCLEdBQXpCLFVBQTBCLE1BQWM7UUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFDLFVBQUMsYUFBcUIsSUFBSyxPQUFBLEtBQUcsTUFBTSxHQUFHLGFBQWUsRUFBM0IsQ0FBMkIsRUFBQyxDQUFDO0lBQ3hHLENBQUM7O2dCQVpGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIseUtBQXNDOztpQkFFdkM7Ozt1QkFFRSxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzs7SUFLUixzQkFBQztDQUFBLEFBYkQsSUFhQztTQVJZLGVBQWU7O0lBQzFCLCtCQUEyQztJQUMzQywrQkFBNEM7SUFDNUMsZ0NBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgdHlwZSBCdXR0b25UeXBlID0gJ3NvbGlkJyB8ICdvdXRsaW5lZCcgfCAnbGluayc7XG5leHBvcnQgdHlwZSBCdXR0b25TaXplID0gJ2xhcmdlJyB8ICdtZWRpdW0nIHwgJ3NtYWxsJztcbmV4cG9ydCB0eXBlIEJ1dHRvbkNvbG9yID0gJ25vcm1hbCcgfCAnbmVnYXRpdmUnIHwgJ3Bvc2l0aXZlJyB8ICdhbGVydCc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwdXBhLWJ1dHRvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9idXR0b24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9idXR0b24uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25Db21wb25lbnQge1xuICBASW5wdXQoKSBwdWJsaWMgdHlwZTogQnV0dG9uVHlwZSA9ICdzb2xpZCc7XG4gIEBJbnB1dCgpIHB1YmxpYyBzaXplOiBCdXR0b25TaXplID0gJ21lZGl1bSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcjogQnV0dG9uQ29sb3IgPSAnbm9ybWFsJztcblxuICBwdWJsaWMgZ2V0UmVzdWx0Q2xhc3NMaXN0KHByZWZpeDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbdGhpcy50eXBlLCB0aGlzLnNpemUsIHRoaXMuY29sb3JdLm1hcCgoaW5uZXJQcm9wZXJ0eTogc3RyaW5nKSA9PiBgJHtwcmVmaXh9JHtpbm5lclByb3BlcnR5fWApO1xuICB9XG59XG4iXX0=