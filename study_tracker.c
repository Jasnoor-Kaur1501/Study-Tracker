#include <stdio.h>
#include <string.h>
#include <time.h>

void logStudy() {
    FILE *file = fopen("study_log.txt", "a");
    if (!file) {
        printf("Error opening study_log.txt\n");
        return;
    }

    char subject[100];
    float hours;
    time_t now = time(NULL);

    printf("\nEnter subject: ");
    scanf("%99s", subject);

    printf("Enter hours studied: ");
    scanf("%f", &hours);

    fprintf(file, "%s | %.2f hours | %s", subject, hours, ctime(&now));
    fclose(file);

    printf("\n✔ Study session logged successfully!\n");
}

void viewLog() {
    FILE *file = fopen("study_log.txt", "r");
    if (!file) {
        printf("\nNo log found. Log something first.\n");
        return;
    }

    char line[200];
    printf("\n=== Study History ===\n");
    while (fgets(line, sizeof(line), file)) {
        printf("%s", line);
    }
    fclose(file);
}

void totalHours() {
    FILE *file = fopen("study_log.txt", "r");
    if (!file) {
        printf("\nNo log found.\n");
        return;
    }

    char subject[100];
    float hours;
    char date[200];
    float total = 0;

    while (fscanf(file, "%s | %f hours | %[^\n]\n", subject, &hours, date) == 3) {
        total += hours;
    }
    fclose(file);

    printf("\n📊 Total hours studied: %.2f\n", total);
}

int main() {
    int choice;

    while (1) {
        printf("\n========================\n");
        printf("      STUDY TRACKER     \n");
        printf("========================\n");
        printf("1. Log Study Session\n");
        printf("2. View Study Log\n");
        printf("3. View Total Hours\n");
        printf("4. Exit\n");
        printf("Choose: ");

        scanf("%d", &choice);

        switch (choice) {
            case 1: logStudy(); break;
            case 2: viewLog(); break;
            case 3: totalHours(); break;
            case 4: printf("\nExiting...\n"); return 0;
            default: printf("\nInvalid option.\n");
        }
    }
}
