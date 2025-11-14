#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "study.h"
#include "utils.h"

#define FILE_NAME "data.txt"

void addSession() {
    StudySession s;
    printf("\nEnter subject: ");
    scanf("%s", s.subject);

    printf("Enter hours: ");
    scanf("%f", &s.hours);

    getTodayDate(s.date);

    FILE *f = fopen(FILE_NAME, "a");
    fprintf(f, "%s %.2f %s\n", s.subject, s.hours, s.date);
    fclose(f);

    printf("\n✔ Session added!\n");
}

void viewSessions() {
    FILE *f = fopen(FILE_NAME, "r");
    if (!f) {
        printf("\nNo data yet.\n");
        return;
    }

    StudySession s;
    printf("\n=== ALL SESSIONS ===\n");
    while (fscanf(f, "%s %f %s", s.subject, &s.hours, s.date) != EOF) {
        printf("%s | %.2f hrs | %s\n", s.subject, s.hours, s.date);
    }
    fclose(f);
}

void deleteSession() {
    char target[20];
    printf("\nEnter date to delete (YYYY-MM-DD): ");
    scanf("%s", target);

    FILE *f = fopen(FILE_NAME, "r");
    FILE *temp = fopen("temp.txt", "w");

    StudySession s;
    int found = 0;

    while (fscanf(f, "%s %f %s", s.subject, &s.hours, s.date) != EOF) {
        if (strcmp(s.date, target) == 0) {
            found = 1;
            continue;
        }
        fprintf(temp, "%s %.2f %s\n", s.subject, s.hours, s.date);
    }

    fclose(f);
    fclose(temp);

    remove(FILE_NAME);
    rename("temp.txt", FILE_NAME);

    found ? printf("\n✔ Deleted!\n") : printf("\nNo entry found.\n");
}

void editSession() {
    char target[20];
    printf("\nEnter date to edit (YYYY-MM-DD): ");
    scanf("%s", target);

    FILE *f = fopen(FILE_NAME, "r");
    FILE *temp = fopen("temp.txt", "w");
    StudySession s;
    int found = 0;

    while (fscanf(f, "%s %f %s", s.subject, &s.hours, s.date) != EOF) {
        if (strcmp(s.date, target) == 0) {
            found = 1;
            printf("New subject: ");
            scanf("%s", s.subject);
            printf("New hours: ");
            scanf("%f", &s.hours);
        }
        fprintf(temp, "%s %.2f %s\n", s.subject, s.hours, s.date);
    }

    fclose(f);
    fclose(temp);

    remove(FILE_NAME);
    rename("temp.txt", FILE_NAME);

    found ? printf("\n✔ Updated!\n") : printf("\nNo entry found.\n");
}

void dailyTotal() {
    char today[20];
    getTodayDate(today);

    FILE *f = fopen(FILE_NAME, "r");
    if (!f) return;

    StudySession s;
    float total = 0;

    while (fscanf(f, "%s %f %s", s.subject, &s.hours, s.date) != EOF) {
        if (strcmp(s.date, today) == 0) total += s.hours;
    }
    fclose(f);

    printf("\n📌 Today’s total: %.2f hours\n", total);
}

void weeklyTotal() {
    char week[7][20];
    getWeekDates(week);

    FILE *f = fopen(FILE_NAME, "r");
    if (!f) return;

    StudySession s;
    float total = 0;

    while (fscanf(f, "%s %f %s", s.subject, &s.hours, s.date) != EOF) {
        for (int i = 0; i < 7; i++) {
            if (strcmp(s.date, week[i]) == 0) {
                total += s.hours;
            }
        }
    }

    fclose(f);
    printf("\n📌 Weekly total: %.2f hours\n", total);
}
