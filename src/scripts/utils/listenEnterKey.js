import { handleMessage } from './handleMessage';

export const listenEnterKey = event => {
    if (event.keyCode === 13)
        handleMessage()
}