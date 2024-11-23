import { errorHandling } from './errors.js';
import { routingHandling } from './routing.js';
import { addToastsEventListeners } from './toasts.js';

errorHandling();
routingHandling();
addToastsEventListeners();
