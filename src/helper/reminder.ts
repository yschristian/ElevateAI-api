import scheduleServices from '../services/ScheduleServices';
import mailer from './mail';

export const reminderSchedule = async () => {
    const schedules = await scheduleServices.getAllSchedules();
    const currentTime = new Date();

    for (let schedule of schedules) {
        const scheduleTime = new Date(schedule.date);
        if (
            schedule.active &&
            scheduleTime > currentTime &&
            scheduleTime <= new Date(currentTime.getTime() + 10 * 60 * 1000)
        ) {
            const userInfo = {
                email: schedule.user.email,
                firstName: schedule.user.firstName,
                scheduleDetails: `Title: ${schedule.title}, Date: ${schedule.date}, Time: ${schedule.time}`,
            };
            await mailer(userInfo, 'ScheduleReminder');
            console.log(`Reminder email sent to ${userInfo.email} for schedule ID: ${schedule.id}`);
        }
    }
}