import {Injectable} from '@angular/core';

interface ToastConfig {
  closeButton?: boolean;
  timeOut?: number;
  progressBar?: boolean;
  toastClass?: string;
  positionClass?: string;
  titleClass?: string;
  messageClass?: string;
  customIcon?: string; // SVG string
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastContainerId = 'toast-container';

  constructor() {
  }

  public show(type: string, message: string, configs: ToastConfig = {}): void {
    this.setupContainer();
    const toastElement = this.createToastElement(type, message, configs);
    this.appendToastToContainer(toastElement);
  }

  private createToastElement(type: string, message: string, configs: ToastConfig): HTMLElement {
    const {
      closeButton = false,
      timeOut = 5000,
      progressBar = false,
      toastClass = 'toast',
      positionClass = 'toast-top-right',
      messageClass = 'toast-message',
      customIcon
    } = configs;

    const toastElement = document.createElement('div');
    toastElement.className = `${toastClass} ${positionClass}`;
    toastElement.setAttribute('role', 'alert');

    const iconHtml = customIcon ? customIcon : this.getIconSvg(type);
    const iconColorClass = this.getIconColorClass(type);

    toastElement.innerHTML = `
      <div class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconColorClass} bg-${type}-100 rounded-lg dark:bg-${type}-800 dark:text-${type}-200">
          ${iconHtml}
          <span class="sr-only">${type} icon</span>
        </div>
        <div class="ms-3 mr-3 text-sm font-normal ${messageClass}">${message}  </div>
        ${closeButton ? this.getCloseButtonHtml(type) : ''}
      </div>
    `;

    if (progressBar) {
      const progressElement = document.createElement('div');
      progressElement.className = 'toast-progress';
      progressElement.style.animationDuration = `${timeOut}ms`;
      toastElement.appendChild(progressElement);
    }

    if (closeButton) {
      const closeButtonElement = toastElement.querySelector('.toast-close-button');
      if (closeButtonElement) {
        closeButtonElement.addEventListener('click', () => {
          this.removeToastElement(toastElement);
        });
      }
    }

    setTimeout(() => {
      this.removeToastElement(toastElement);
    }, timeOut);

    return toastElement;
  }

  private getIconColorClass(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'default':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  }

  private getIconSvg(type: string): string {
    switch (type) {
      case 'success':
        return '<svg aria-hidden="true" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />  <polyline points="22 4 12 14.01 9 11.01" /></svg>';
      case 'info':
        return '<svg aria-hidden="true" class="w-6 h-6" fill="none" viewBox="0 0 18 20" stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>';
      case 'warning':
        return '<svg aria-hidden="true" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />  <line x1="12" y1="9" x2="12" y2="13" />  <line x1="12" y1="17" x2="12.01" y2="17" /></svg>';
      case 'error':
        return '<svg aria-hidden="true" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>';
      default:
        return '';
    }
  }

  private getCloseButtonHtml(type: string): string {
    return `
      <button aria-label="Close"
              class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-${type}" type="button">
        <span class="sr-only">Close</span>
        ${this.getCloseIconSvg()}
      </button>
    `;
  }

  private getCloseIconSvg(): string {
    return '<svg aria-hidden="true" class="w-3 h-3" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>';
  }

  private appendToastToContainer(toastElement: HTMLElement): void {
    const container = document.getElementById(this.toastContainerId);
    if (container) {
      container.appendChild(toastElement);
    }
  }

  private removeToastElement(toastElement: HTMLElement): void {
    if (toastElement) {
      toastElement.remove();
    }
  }

  private setupContainer(): void {
    if (!document.getElementById(this.toastContainerId)) {
      const container = document.createElement('div');
      container.id = this.toastContainerId;
      document.body.appendChild(container);
    }
  }
}
