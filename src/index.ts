import { check_status } from "./check_status"
import { CaptureException } from "./logging/sentry"

const main = async () => {
    try {
        check_status()
    } catch (e) {
        CaptureException(e, {})
    }
}

main()