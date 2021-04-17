import {store} from "react-notifications-component";

export let showMessage = (messages) => {
    messages.forEach(el => store.addNotification({
        title: 'Title',
        message: el.message,
        type: el.type,                           // 'default', 'success', 'info', 'warning'
        container: 'top-right',                  // where to position the notifications
        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
        dismiss: {
            duration: 10000
        }
    }))
}
