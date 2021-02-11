# Simple Accounting Softward
React front end for a simple accounting software.
## Main Features
- Manage multiple companies.
- Manage revenues, expenses, and accounts payable and receivable.
  - Revenues and expenses may be tied to accounts payable / receivable.
- Manage clients and providers.
  - View current debtors and debtees at a glance, as well as their balance.
- Group transactions into projects.
  - Glance and detailed view of current state of project vis-à-vis remaining payments, values, profits.
- Monthly and annual summaries
  - Can be exported into excel
- Teamwork
  - Team members can be invited and their privileges set so that they may contribute with any necessary data collection.
## Implementation
- React is used for the front end of the application, while the back end is handled by a custom Rails API ([see API code here](https://github.com/rafaelhrtd/abacont-backend))
- AXIOS calls are made to the API, which uses JWT and devise for authentication.
- Access privileges are managed in the back end through a CanCan implementation.
## Running Website
[Truss Problems](https://www.abacont.app/)
## Screenshots
Here are some examples of the different components of this application:
### Monthly Summary
A frame can be observed with a force acting on member (3).

![Example Frame](screenshots/truss.png)
### External Solution
Once the "Solve" button is clicked, the reaction forces at the supports are displayed, and internal reactions are calculated.

![External solution](screenshots/external-solution.png)
### Internal Reactions
Clicking on a member leads to the internal reactions.

![Internal reactions](screenshots/internal-reactions.png)