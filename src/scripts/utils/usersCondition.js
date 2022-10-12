import { activeUsers } from "../constants/constants";

export const usersCondition = () => {
    return activeUsers.length > 0
}