#ifndef STUDY_H
#define STUDY_H

typedef struct {
    char subject[50];
    float hours;
    char date[20];
} StudySession;

void addSession();
void viewSessions();
void deleteSession();
void editSession();
void dailyTotal();
void weeklyTotal();

#endif
