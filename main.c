#include <stdio.h>
#include "study.h"

int main() {
    int choice;

    while (1) {
        printf("\n===============================\n");
        printf("       STUDY TRACKER (C)       \n");
        printf("===============================\n");
        printf("1. Add Study Session\n");
        printf("2. View All Sessions\n");
        printf("3. Edit a Session\n");
        printf("4. Delete a Session\n");
        printf("5. Today’s Total Hours\n");
        printf("6. Weekly Total Hours\n");
        printf("7. Exit\n");
        printf("Choose: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addSession(); break;
            case 2: viewSessions(); break;
            case 3: editSession(); break;
            case 4: deleteSession(); break;
            case 5: dailyTotal(); break;
            case 6: weeklyTotal(); break;
            case 7: return 0;
            default: printf("\nInvalid.\n");
        }
    }
}
