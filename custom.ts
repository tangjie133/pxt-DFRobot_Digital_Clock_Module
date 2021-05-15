
enum MyRTCData {
    //% block="second"
    Second,
    //% block="minute"
    Minute,
    //% block="hour"
    Hour,
    //% block="week"
    Week,
    //% block="day"
    Day,
    //% block="month"
    Month,
    //% block="year"
    Year
    
   
}
enum MyStatic{
    //% block="stop"
    Stop,
    //% block="start"
    Start
}

/**
 * 时钟模块图形化模块
 */
//% weight=100 color=#0fbc11 icon="\uf017"
namespace custom {
    let addr = 0x16;
    /**
     * TODO: 设置时钟模块的年月日时分秒
     * @param year   设置年参数, eg: 2021
     * @param month  设置月参数, eg: 4
     * @param day    设置日参数, eg:27
     * @param week   设置星期几, eg:2
     * @param hour   设置时参数, eg:10
     * @param minute 设置分参数, eg:00
     * @param second 设置秒参数, eg:00
     */
    //% block="set RTC year %year,month %month,day %day,week %week,hour %hour,minute %minute,second %second"
    //% year.min=2000 year.max=2099
    //% month.min=1 month.max=12
    //% day.min=1 day.max=31
    //% week.min=1 week.max=7
    //% hour.min=0 hour.max=23
    //% minute.min=0 minute.max=59
    //% second.min=0 second.max=59
    //%weight=99
    export function setRTCData(year: number, month: number, day:number, week:number, hour:number, minute:number, second:number): void {
        let buffer = pins.createBuffer(8);
        compare(year,month,day);
        buffer[0]=0x00;
        buffer[1]=second;
        buffer[2]=minute;
        buffer[3]=hour;
        buffer[4]=week;
        buffer[5]=day;
        buffer[6]=month;
        buffer[7]=year-2000;
        pins.i2cWriteBuffer(addr, buffer);
    }

    /**
     * TODO: 获取时钟模块数据
     * @param data 获取RTC数据
     */
    //% block="read RTC data %data"
    //%weight=98
    export function getRTCData(data: MyRTCData): number {
        let RTCData;
        pins.i2cWriteNumber(addr, 0, NumberFormat.Int8LE);
        basic.pause(50);
        let buffer = pins.i2cReadBuffer(addr, 7);
        switch(data){
            case MyRTCData.Second:
                RTCData = buffer[0];
            break;
            case MyRTCData.Minute:
                RTCData = buffer[1];
            break;
            case MyRTCData.Hour:
                RTCData = buffer[2];
            break;
            case MyRTCData.Week:
                RTCData = buffer[3];
            break;
            case MyRTCData.Day:
                RTCData = buffer[4];
            break;
            case MyRTCData.Month:
                RTCData = buffer[5];
            break;
            case MyRTCData.Year:
                RTCData = buffer[6];
            break;
            default:
                RTCData = 0;
            break;
        }
        return RTCData;
    }
    /**
     * TODO:设置年
     * @param year 设置年参数, eg:2021
     */
    //% block="set year %year"
    //% weight=97
    //% year.min=2000 year.max=2099
    export function setYear(year:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0x06;
        buffer[1]=year;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO:设置月
     * @param month 设置月参数, eg:4
     */
    //% block="set month %month"
    //% weight=96
    //% month.min=1 month.max=12
    export function setMonth(month:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0x05;
        buffer[1]=month;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO:设置日
     * @param day 设置日参数, eg:27
     */
    //% block="set day %day"
    //% weight=95
    //% day.min=1 day.max=31
    export function setDay(day:number):void{
        pins.i2cWriteNumber(addr, 0, NumberFormat.Int8LE);
        basic.pause(50);
        let data = pins.i2cReadBuffer(addr, 7);
        compare(data[6],data[5],day);
        let buffer = pins.createBuffer(2);
        buffer[0]=0x04;
        buffer[1]=day;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO: 设置星期
     * @param week 设置星期参数, eg:2
     */
    //% block="set week %week"
    //% weight=94
    //% week.min=1 week.max=7
    export function setWeek(week:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0x03;
        buffer[1]=week;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO: 设置小时
     * @param hour 设置小时参数, eg:5
     */
    //% block="set hour %hour"
    //% weight=93
    //% hour.min=0 hour.max=23
    export function setHour(hour:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0x02;
        buffer[1]=hour;
        pins.i2cWriteBuffer(addr, buffer);        
    }
    /**
     * TODO: 设置分钟
     * @param minute 设置分钟参数, eg:30
     */
    //% block="set minute %minute"
    //% weight=92
    //% minute.min=0 minute.max=59
    export function setMinute(minute:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0x01;
        buffer[1]=minute;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO: 设置秒
     * @param second 设置秒参数, eg:30
     */
    //% block="set second %second"
    //% second.min=0 second.max=59
    //% weight=91
    export function setSecond(second:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0x00;
        buffer[1]=second;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO:设置倒计时
     * @param static 开始/停止
     * @param minute 分钟参数, eg:30
     * @param second 秒参数, eg:30
     */
    //%block="set count down %mystatic minute %minute second %second"
    //% minute.min=0 minute.max=99
    //% second.min=0 second.max=59
    //%weight=90
    export function countdown(mystatic:MyStatic, minute:number, second:number):void{
        let buffer = pins.createBuffer(4);
        buffer[0]=0xA0;
        buffer[1]=mystatic;
        buffer[2]=second;
        buffer[3]=minute;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO:获取倒计时状态
     */
    //%block="get the countdown status"
    //%weight=89
    export function getcountdownStatic():number{
        pins.i2cWriteNumber(addr, 0XA0, NumberFormat.Int8LE);
        basic.pause(50);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }
    /**
     * TODO:设置正计时
     * @param static 开始/停止
     * @param minute 分钟参数, eg:30
     * @param second 秒参数, eg:30
     */
    //%block="set positive timing %mystatic minute %minute second %second"
    //% minute.min=0 minute.max=99
    //% second.min=0 second.max=59
    //%weight=88
    export function countup(mystatic:MyStatic, minute:number, second:number):void{
        let buffer = pins.createBuffer(4);
        buffer[0]=0X07;
        buffer[1]=mystatic;
        buffer[2]=second;
        buffer[3]=minute;
        pins.i2cWriteBuffer(addr, buffer);
    }
    /**
     * TODO:获取正计时状态
     */
    //%block="gets the positive timing status"
    //%weight=87
    export function getcountupStatic():number{
        pins.i2cWriteNumber(addr, 0X07, NumberFormat.Int8LE);
        basic.pause(50);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }


    function compare(year:number, month:number, day:number):void{
        if(month == 2){
           let state = (((year%4==0)&&(year%100!=0))||(year%400==0))?1:0;
            if(state ==1){
                if(day>29){
                    while(1){
                        basic.showString("February has only 29 days!!!!!!")
                    }
                }
            }else{
                if(day>28){
                    while(1){
                        basic.showString("February has only 28 days!!!!!!")
                    }
                }
            }
        }else if(month == 4){
            if(day > 30){
                while(1){
                        basic.showString("April has only 30 days!!!!!!")
                }
            }
        }else if(month == 6){
            if(day > 30){
                while(1){
                        basic.showString("June has only 30 days!!!!!!")
                }
            }
        }else if(month == 9){
            if(day > 30){
                while(1){
                        basic.showString("September has only 30 days!!!!!!")
                }
            }
        }else if (month == 11){
            if(day > 30){
                while(1){
                        basic.showString("November has only 30 days!!!!!!")
                }
            }
        }
    }
}
