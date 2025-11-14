#include <stdio.h>
#include <time.h>
#include "utils.h"

void getTodayDate(char *buffer) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    strftime(buffer, 20, "%Y-%m-%d", t);
}

void getWeekDates(char dates[7][20]) {
    time_t now = time(NULL);
    struct tm t = *localtime(&now);

    for (int i = 0; i < 7; i++) {
        struct tm temp = t;
        temp.tm_mday -= i;
        mktime(&temp);
        strftime(dates[i], 20, "%Y-%m-%d", &temp);
    }
}
