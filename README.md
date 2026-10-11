# KBEST — Kanyuambora Boys High School

Parent and teacher portal for results (Form 1 to Form 4), progress from entry to exit, and messages between guardians and teachers. The site is one page, `index.html`. The design and the portal are inside that file, so GitHub Pages still shows the school site if the `css` or `js` folders were not uploaded. It runs with no build step and no server.

## Publish on GitHub Pages

1. Create a repository and upload this folder so `index.html` is at the root (not inside another folder).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then save.
5. Open the Pages URL GitHub shows, usually `https://<user>.github.io/<repository>/`.

Keep `.nojekyll` in the repository so GitHub serves the files as they are.

## Sample sign-in

Password for every sample account: `kbest2026`

You can also type the admission number or staff ID again as the password.

| Who | ID |
| --- | --- |
| Parent of Brian Njeru, Form 4 North | `KBEST-4N-001` |
| Parent, Form 2 South | `KBEST-2S-010` |
| Class teacher, Form 4 North | `CT-4N` |
| Principal | `PRINCIPAL` |

Any admission number on the sample register can sign in the same way. Class teacher IDs run from `CT-1N` to `CT-4E` (North, South, West, East). Leadership IDs are `PRINCIPAL`, `DEPUTY`, and `DEAN`.

## How the data works

Student names, marks, and staff names are generated in the browser so the portal can be demonstrated immediately. Messages are saved in that browser only (`localStorage`). Two parents on different phones will not see each other’s messages until the school connects a private server.

Do not put real student results, phone numbers, or passwords in this public repository. Anyone can read a GitHub Pages site and its JavaScript. Before real records are used, replace the sample register with a private database and real authentication.

## Check the register locally

```bash
node js/school.js --check
```
