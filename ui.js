(function () {
  var app = document.getElementById("app");
  var nav = document.getElementById("site-nav");
  var state = {
    loginKind: "parent",
    loginId: "",
    loginPassword: "",
    error: "",
    tab: "overview",
    form: null,
    term: null,
    channel: "",
    threadAdm: "",
    q: "",
    filterForm: "",
    filterStream: "",
    studentAdm: "",
    notice: ""
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function session() {
    try {
      var raw = sessionStorage.getItem("kbest.session.v1");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function setSession(value) {
    if (value) sessionStorage.setItem("kbest.session.v1", JSON.stringify(value));
    else sessionStorage.removeItem("kbest.session.v1");
  }

  function route() {
    var hash = (location.hash || "#home").replace(/^#\/?/, "");
    var allowed = { home: 1, academics: 1, contact: 1, login: 1, portal: 1 };
    return allowed[hash] ? hash : "home";
  }

  function signed(n) {
    var text = n.toFixed(2);
    return n > 0 ? "+" + text : text;
  }

  function deltaClass(n) {
    if (n > 0.05) return "delta-up";
    if (n < -0.05) return "delta-down";
    return "delta-flat";
  }

  function gradeClass(grade) {
    var letter = String(grade || "E").charAt(0).toLowerCase();
    return "grade g-" + letter;
  }

  function when(iso) {
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
  }

  function studentOf(sess) {
    if (!sess) return null;
    if (sess.kind === "parent") return KBEST.studentByAdm(sess.studentAdm);
    return KBEST.studentByAdm(state.studentAdm);
  }

  function paintNav() {
    var current = route();
    var sess = session();
    nav.querySelectorAll("a").forEach(function (link) {
      var target = link.getAttribute("data-route");
      var on = target === current || (target === "login" && current === "portal");
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    var portal = document.getElementById("nav-portal");
    if (sess) {
      portal.textContent = "Dashboard";
      portal.href = "#portal";
      portal.setAttribute("data-route", "portal");
    } else {
      portal.textContent = "Portal";
      portal.href = "#login";
      portal.setAttribute("data-route", "login");
    }
  }

  function shell(title, inner) {
    document.title = title + " · KBEST";
    app.innerHTML = inner;
    paintNav();
    var canvas = app.querySelector("canvas[data-chart]");
    if (canvas) drawChart(canvas);
  }

  function homePage() {
    var school = KBEST.getSchool();
    var sample = KBEST.studentByAdm("KBEST-4N-001");
    var latest = sample.terms[sample.terms.length - 1];
    var rows = latest.subjects.slice(0, 4).map(function (subject) {
      return "<tr><td>" + esc(subject.name) + "</td><td>" + subject.score + "</td><td><span class='" + gradeClass(subject.grade) + "'>" + esc(subject.grade) + "</span></td></tr>";
    }).join("");
    var streamCards = KBEST.STREAMS.map(function (stream) {
      var colors = { North: "#1f6b4a", South: "#0e3b2e", West: "#8a6a32", East: "#245c73" };
      return "<article class='card stream-card' style='--stream:" + colors[stream] + "'><h3>Form streams · " + stream + "</h3><p>Forms 1 to 4. " + KBEST.STREAM_SIZE[stream] + " students in each form, within the 50-student stream limit.</p><p><a href='#academics'>Class teachers</a></p></article>";
    }).join("");
    shell("Home", ""
      + "<section class='wrap hero'>"
      + "<div><p class='kicker'>Mbeere North · Embu County</p>"
      + "<h1>Kanyuambora Boys High School</h1>"
      + "<p class='lede'>KBEST is the school portal for parents and teachers. After a parent signs in with the student’s admission number, Form 1 to Form 4 results, the full progress from entry to exit, and a direct line to the class teacher are available in one place.</p>"
      + "<div class='hero-actions'><a class='btn' href='#login'>Enter the portal</a><a class='btn btn-ghost' href='#academics'>How the school is organised</a></div></div>"
      + "<aside class='hero-card locked-preview'><div class='mini-meta'><span>" + esc(sample.name) + "</span><span>" + esc(sample.adm) + "</span></div>"
      + "<div class='table-wrap'><table><thead><tr><th>Subject</th><th>Score</th><th>Grade</th></tr></thead><tbody>" + rows + "</tbody></table></div>"
      + "<div class='lock-note'>Results stay behind parent or teacher sign-in. This preview uses the sample register.</div></aside>"
      + "</section>"
      + "<section class='wrap trust'>"
      + "<div><span>School</span><strong>KBEST</strong></div>"
      + "<div><span>Students on register</span><strong>" + school.students.length + "</strong></div>"
      + "<div><span>Forms</span><strong>1 – 4</strong></div>"
      + "<div><span>Streams</span><strong>N · S · W · E</strong></div>"
      + "<div><span>Class teachers</span><strong>16</strong></div>"
      + "</section>"
      + "<section class='wrap section'><div class='section-head'><h2>A clear line between home and school</h2><p>The portal is for academic progress and student welfare. Each conversation is tied to one student and one member of staff.</p></div>"
      + "<div class='grid-3'>"
      + "<article class='card'><h3>Results</h3><p>Termly scores from Form 1 to Form 4, with grades, mean, stream position, conduct, and the class teacher’s remark.</p></article>"
      + "<article class='card'><h3>Entry to exit</h3><p>A parent can follow the mean from the first term in school to the current form, including the Form 4 exit year.</p></article>"
      + "<article class='card'><h3>Messages</h3><p>Write to the class teacher, the deputy principal, the dean of students, or the principal about that student.</p></article>"
      + "</div></section>"
      + "<section class='wrap section'><div class='section-head'><h2>Four streams in every form</h2><p>North, South, West, and East. No stream carries more than 50 students.</p></div><div class='grid-4'>" + streamCards + "</div></section>"
      + "<section class='wrap section'><div class='section-head'><h2>How a parent uses KBEST</h2></div><div class='grid-3 steps'>"
      + "<article class='card'><h3>Sign in</h3><p>Use the admission number and the password issued for that student. On this sample register the password is kbest2026, or the admission number again.</p></article>"
      + "<article class='card'><h3>Read the record</h3><p>Open results for any completed term, and the progress view for the journey since Form 1.</p></article>"
      + "<article class='card'><h3>Write to school</h3><p>Send a specific, respectful note to the class teacher or another office. Replies stay on that student’s thread.</p></article>"
      + "</div></section>");
  }

  function academicsPage() {
    var teachers = Object.keys(KBEST.CLASS_TEACHERS).map(function (key) {
      var teacher = KBEST.CLASS_TEACHERS[key];
      return "<tr><td>Form " + teacher.form + "</td><td>" + esc(teacher.stream) + "</td><td>" + esc(teacher.name) + "</td><td>" + esc(teacher.subject) + "</td><td><code>" + esc(teacher.id) + "</code></td></tr>";
    }).join("");
    var leaders = KBEST.LEADERSHIP.map(function (person) {
      return "<tr><td>" + esc(person.title) + "</td><td>" + esc(person.name) + "</td><td><code>" + esc(person.id) + "</code></td></tr>";
    }).join("");
    shell("Academics", ""
      + "<section class='wrap page'>"
      + "<p class='kicker'>Forms 1 to 4</p><h1>Academic structure</h1>"
      + "<p class='lede'>Every form is divided into North, South, West, and East. A class teacher follows that stream and is the first person a parent writes to.</p>"
      + "<div class='grid-2' style='margin-top:22px'>"
      + "<article class='card'><h3>Subjects on the report</h3><p>Each student takes eight subjects: English, Kiswahili, Mathematics, two sciences, two humanities, and one applied subject. The term mean is the average of all eight.</p>"
      + "<p>Grades follow the familiar secondary scale from A (12 points) to E (1 point). A mean grade is worked from the average points.</p></article>"
      + "<article class='card'><h3>What parents can see</h3><p>After sign-in: every term from Form 1, the latest stream position, attendance, conduct, and a written remark. Form 4 shows the path through the exit year. KCSE certificates are released by KNEC and are not invented here.</p></article>"
      + "</div>"
      + "<h2 style='margin-top:28px'>Class teachers</h2>"
      + "<p class='note'>These names are the sample staff directory so messaging can be tried immediately. Replace them when the school connects its real staff list.</p>"
      + "<div class='table-wrap card' style='padding:8px 12px'><table><thead><tr><th>Form</th><th>Stream</th><th>Class teacher</th><th>Teaching subject</th><th>Staff ID</th></tr></thead><tbody>" + teachers + "</tbody></table></div>"
      + "<h2 style='margin-top:28px'>Offices a parent can also reach</h2>"
      + "<div class='table-wrap card' style='padding:8px 12px'><table><thead><tr><th>Office</th><th>Name</th><th>Staff ID</th></tr></thead><tbody>" + leaders + "</tbody></table></div>"
      + "</section>");
  }

  function contactPage() {
    shell("Contact", ""
      + "<section class='wrap page'>"
      + "<p class='kicker'>School office</p><h1>Contact KBEST</h1>"
      + "<div class='grid-2'>"
      + "<article class='card'><h3>Visit the school</h3><p>Kanyuambora Boys High School<br>Kanyuambora, near Ishiara<br>Mbeere North Sub-County<br>Embu County, Kenya</p><p>KNEC code 14312301<br>Public boarding boys’ school</p></article>"
      + "<article class='card'><h3>Use the right channel</h3><p>Questions about classwork, progress, discipline, or a planned absence belong in the portal, addressed to the class teacher or the relevant office.</p><p>If a student is unwell or there is an emergency, contact the school administration directly. Do not wait for a portal reply.</p><p><a class='btn' href='#login'>Open the portal</a></p></article>"
      + "</div></section>");
  }

  function loginPage() {
    var kind = state.loginKind;
    shell("Sign in", ""
      + "<section class='wrap page login-layout'>"
      + "<div><p class='kicker'>Parent and teacher portal</p><h1>Sign in to KBEST</h1>"
      + "<p class='lede'>Parents use the student’s admission number. Teachers use a staff ID. Results and messages open only after the details match the register.</p>"
      + "<div class='note'>Sample password for every demonstration account: <strong>" + esc(KBEST.DEMO_PASSWORD) + "</strong>. You may also type the admission number or staff ID again as the password.</div>"
      + "<div class='chips'>"
      + "<button class='chip' type='button' data-action='fill' data-kind='parent' data-id='KBEST-4N-001'>Parent · KBEST-4N-001</button>"
      + "<button class='chip' type='button' data-action='fill' data-kind='parent' data-id='KBEST-2S-010'>Parent · KBEST-2S-010</button>"
      + "<button class='chip' type='button' data-action='fill' data-kind='staff' data-id='CT-4N'>Class teacher · CT-4N</button>"
      + "<button class='chip' type='button' data-action='fill' data-kind='staff' data-id='PRINCIPAL'>Principal</button>"
      + "</div></div>"
      + "<form class='panel' data-action='login'>"
      + "<div class='seg'>"
      + "<button class='btn btn-ghost' type='button' data-action='kind' data-kind='parent' aria-pressed='" + (kind === "parent") + "'>Parent</button>"
      + "<button class='btn btn-ghost' type='button' data-action='kind' data-kind='staff' aria-pressed='" + (kind === "staff") + "'>Teacher</button>"
      + "</div>"
      + (state.error ? "<p class='error' role='alert'>" + esc(state.error) + "</p>" : "")
      + "<label>" + (kind === "parent" ? "Admission number" : "Staff ID")
      + "<input name='id' autocomplete='username' required value='" + esc(state.loginId) + "' placeholder='" + (kind === "parent" ? "KBEST-4N-001" : "CT-4N") + "'></label>"
      + "<label>Password<input name='password' type='password' autocomplete='current-password' required value='" + esc(state.loginPassword) + "'></label>"
      + "<button class='btn' type='submit'>Sign in</button>"
      + "</form></section>");
  }

  function tabButton(id, label, current, extra, root) {
    return "<button class='btn btn-ghost btn-small' type='button' data-action='tab' data-tab='" + id + "'" + (root ? " data-root='1'" : "") + " aria-selected='" + (current === id) + "'>" + label + (extra || "") + "</button>";
  }

  function overviewBlock(student, sess) {
    var delta = student.latestPoints - student.entryPoints;
    var years = KBEST.yearSummaries(student).map(function (year) {
      return "<article><div class='year-mark'>Form " + year.form + "</div><div><strong>" + year.year + "</strong> · mean " + esc(year.meanGrade) + " (" + year.meanPoints.toFixed(2) + " points) · " + year.assessments + " assessments</div></article>";
    }).join("");
    return "<div class='stats'>"
      + "<div class='stat'><span>Latest mean</span><strong>" + esc(student.latestGrade) + "</strong></div>"
      + "<div class='stat'><span>Entry mean</span><strong>" + esc(student.entryGrade) + "</strong></div>"
      + "<div class='stat'><span>Change in points</span><strong class='" + deltaClass(delta) + "'>" + signed(delta) + "</strong></div>"
      + "<div class='stat'><span>Stream position</span><strong>" + student.position + " / " + student.streamSize + "</strong></div>"
      + "</div>"
      + "<div class='grid-2'><article class='card'><h3>Progress from entry</h3><p>" + esc(KBEST.narrative(student)) + "</p>"
      + "<div class='timeline'>" + years + "</div></article>"
      + "<article class='card'><h3>Class teacher</h3><p><strong>" + esc(student.teacherName) + "</strong><br>Form " + student.form + " " + esc(student.stream) + "</p>"
      + "<p>Stream average this term: " + student.streamAverage.toFixed(2) + " points. " + (function () {
        var gap = student.latestPoints - student.streamAverage;
        if (gap > 0.05) return student.first + " is " + gap.toFixed(2) + " points above that average.";
        if (gap < -0.05) return student.first + " is " + Math.abs(gap).toFixed(2) + " points under that average.";
        return student.first + " is level with that average.";
      })() + "</p>"
      + "<button class='btn btn-small' type='button' data-action='message-teacher'>" + (sess && sess.kind === "staff" ? "Message guardian" : "Message class teacher") + "</button></article></div>";
  }

  function resultsBlock(student) {
    var selected = KBEST.termBy(student, state.form || student.form, state.term || student.terms[student.terms.length - 1].term);
    var formPills = [];
    var seen = {};
    student.terms.forEach(function (term) {
      if (seen[term.form]) return;
      seen[term.form] = true;
      formPills.push("<button class='btn btn-ghost btn-small' type='button' data-action='form' data-form='" + term.form + "' aria-pressed='" + (selected.form === term.form) + "'>Form " + term.form + "</button>");
    });
    var termPills = student.terms.filter(function (term) { return term.form === selected.form; }).map(function (term) {
      return "<button class='btn btn-ghost btn-small' type='button' data-action='term' data-term='" + term.term + "' aria-pressed='" + (selected.term === term.term && selected.form === term.form) + "'>Term " + term.term + (term.kind === "midterm" ? " midterm" : "") + "</button>";
    }).join("");
    var body = selected.subjects.map(function (subject) {
      return "<tr><td>" + esc(subject.name) + "</td><td>" + subject.score + "</td><td><span class='" + gradeClass(subject.grade) + "'>" + esc(subject.grade) + "</span></td><td>" + subject.points + "</td><td>" + esc(subject.remark) + "</td></tr>";
    }).join("");
    return "<div class='filters no-print'>" + formPills.join("") + termPills + "<button class='btn btn-small btn-gold' type='button' data-action='print'>Print report</button></div>"
      + "<article class='card report-sheet'><div class='mini-meta'><span>KBEST report card</span><span>" + esc(selected.label) + " · " + selected.year + "</span></div>"
      + "<h3>" + esc(student.name) + "</h3><p>" + esc(student.adm) + " · Form " + student.form + " " + esc(student.stream) + " · Guardian: " + esc(student.guardian) + "</p>"
      + "<div class='table-wrap'><table><thead><tr><th>Subject</th><th>Score</th><th>Grade</th><th>Points</th><th>Remark</th></tr></thead><tbody>" + body + "</tbody></table></div>"
      + "<div class='stats'><div class='stat'><span>Mean score</span><strong>" + selected.meanScore.toFixed(1) + "</strong></div>"
      + "<div class='stat'><span>Mean grade</span><strong>" + esc(selected.meanGrade) + "</strong></div>"
      + "<div class='stat'><span>Conduct</span><strong>" + esc(selected.conduct) + "</strong></div>"
      + "<div class='stat'><span>Attendance</span><strong>" + selected.attendance.toFixed(1) + "%</strong></div></div>"
      + "<p><strong>Class teacher remark.</strong> " + esc(selected.remark) + "</p>"
      + "<div class='signatures'><div>Class teacher<br>" + esc(student.teacherName) + "</div><div>Principal<br>Mr. Francis Murimi</div></div></article>";
  }

  function progressBlock(student) {
    var rows = student.terms.map(function (term) {
      return "<tr><td>" + esc(term.label) + "</td><td>" + term.year + "</td><td>" + term.meanScore.toFixed(1) + "</td><td><span class='" + gradeClass(term.meanGrade) + "'>" + esc(term.meanGrade) + "</span></td><td>" + term.meanPoints.toFixed(2) + "</td></tr>";
    }).join("");
    var exit = student.form === 4
      ? "<p>The line below runs from Form 1 entry in " + student.entryYear + " to the Form 4 exit year. The latest mean is the school’s current picture of his standing. The official KCSE result is issued separately by KNEC.</p>"
      : "<p>This chart runs from Form 1 entry to the current form. Later forms are added to the same record as he moves up.</p>";
    return "<article class='card'><h3>Mean points from entry</h3>" + exit
      + "<canvas class='chart' data-chart='" + esc(student.adm) + "' role='img' aria-label='Mean points for " + esc(student.name) + " from Form 1 to the latest assessment'></canvas>"
      + "<div class='table-wrap' style='margin-top:12px'><table><thead><tr><th>Assessment</th><th>Year</th><th>Mean score</th><th>Grade</th><th>Points</th></tr></thead><tbody>" + rows + "</tbody></table></div></article>";
  }

  function messagePane(student, channel, sess) {
    var mine = sess.kind === "parent" ? "parent" : "staff";
    KBEST.markRead(sess, student.adm, channel);
    var items = KBEST.messagesFor(student.adm, channel);
    var bubbles = items.length ? items.map(function (message) {
      var cls = message.sender === mine ? "bubble mine" : "bubble";
      return "<article class='" + cls + "'><small>" + esc(message.senderName) + " · " + esc(message.topic) + " · " + esc(when(message.at)) + "</small><p>" + esc(message.body) + "</p></article>";
    }).join("") : "<p class='note'>No messages on this thread yet. Write clearly about this student.</p>";
    var topics = KBEST.TOPICS.map(function (topic) {
      return "<option>" + esc(topic) + "</option>";
    }).join("");
    return "<div class='bubbles'>" + bubbles + "</div>"
      + "<form data-action='send'><input type='hidden' name='adm' value='" + esc(student.adm) + "'><input type='hidden' name='channel' value='" + esc(channel) + "'>"
      + "<label>Topic<select name='topic'>" + topics + "</select></label>"
      + "<label>Message<textarea name='body' minlength='2' maxlength='1000' required placeholder='Write about this student’s academics or welfare.'></textarea></label>"
      + "<p class='fine'>Be specific and professional. Teachers reply on working days.</p>"
      + (state.notice ? "<p class='error' role='alert'>" + esc(state.notice) + "</p>" : "")
      + "<button class='btn' type='submit'>Send message</button></form>";
  }

  function messagesBlock(student, sess) {
    var recipients = KBEST.recipientsFor(student);
    if (!state.channel) state.channel = student.teacherId;
    KBEST.markRead(sess, student.adm, state.channel);
    var list = recipients.map(function (person) {
      var preview = KBEST.messagesFor(student.adm, person.id);
      var last = preview[preview.length - 1];
      var unread = preview.filter(function (message) {
        var key = sess.kind === "parent" ? "parent" : sess.staffId;
        return message.sender !== (sess.kind === "parent" ? "parent" : "staff") && message.readBy.indexOf(key) === -1;
      }).length;
      return "<button type='button' data-action='channel' data-channel='" + esc(person.id) + "' aria-pressed='" + (state.channel === person.id) + "'><strong>" + esc(person.name) + "</strong><br><small>" + esc(person.title || person.roleLabel || "Class teacher") + (last ? " · " + esc(last.topic) : "") + "</small>" + (unread ? " <span class='badge'>" + unread + "</span>" : "") + "</button>";
    }).join("");
    var active = recipients.filter(function (person) { return person.id === state.channel; })[0] || recipients[0];
    return "<div class='note'>Messages are about " + esc(student.name) + " (" + esc(student.adm) + ") only. If there is an emergency, contact the school office directly.</div>"
      + "<div class='messages' style='margin-top:12px'><div class='thread-list'>" + list + "</div><article class='card'><h3>" + esc(active.name) + "</h3><p>" + esc(active.title || ("Class teacher, Form " + student.form + " " + student.stream)) + "</p>" + messagePane(student, active.id, sess) + "</article></div>";
  }

  function parentPortal(sess) {
    var student = KBEST.studentByAdm(sess.studentAdm);
    if (!state.form) state.form = student.form;
    if (!state.term) state.term = student.terms[student.terms.length - 1].term;
    var body = state.tab === "results" ? resultsBlock(student)
      : state.tab === "progress" ? progressBlock(student)
      : state.tab === "messages" ? messagesBlock(student, sess)
      : overviewBlock(student, sess);
    var unread = KBEST.unreadCount(sess);
    shell("Parent portal", ""
      + "<section class='wrap page'><div class='portal-head'><div><p class='kicker'>Parent portal</p><h1>" + esc(student.name) + "</h1>"
      + "<p class='who'>" + esc(student.adm) + " · Form " + student.form + " " + esc(student.stream) + " · Signed in as " + esc(sess.name) + "</p></div>"
      + "<button class='btn btn-ghost no-print' type='button' data-action='logout'>Sign out</button></div>"
      + "<div class='tabs no-print'>"
      + tabButton("overview", "Overview", state.tab)
      + tabButton("results", "Results", state.tab)
      + tabButton("progress", "Entry to exit", state.tab)
      + tabButton("messages", "Messages", state.tab, unread ? " <span class='badge'>" + unread + "</span>" : "")
      + "</div>" + body
      + "<p class='no-print' style='margin-top:18px'><button class='btn btn-danger btn-small' type='button' data-action='reset'>Reset sample messages</button></p></section>");
  }

  function staffList(sess) {
    var form = sess.scope === "class" ? sess.form : Number(state.filterForm || 0);
    var stream = sess.scope === "class" ? sess.stream : state.filterStream;
    var matched = sess.scope === "class"
      ? KBEST.classList(sess.form, sess.stream).filter(function (student) {
        var q = state.q.trim().toLowerCase();
        if (!q) return true;
        return student.name.toLowerCase().indexOf(q) !== -1 || student.adm.toLowerCase().indexOf(q) !== -1;
      })
      : KBEST.searchStudents(state.q, form || "", stream || "");
    var rows = sess.scope === "class" ? matched : matched.slice(0, 40);
    var trimmed = matched.length > rows.length;
    var body = rows.map(function (student) {
      var delta = student.latestPoints - student.entryPoints;
      return "<tr class='click-row' data-action='open-student' data-adm='" + esc(student.adm) + "'><td>" + student.position + "</td><td><strong>" + esc(student.name) + "</strong><br><small>" + esc(student.adm) + "</small></td>"
        + "<td class='hide-sm'>Form " + student.form + " " + esc(student.stream) + "</td>"
        + "<td><span class='" + gradeClass(student.latestGrade) + "'>" + esc(student.latestGrade) + "</span></td>"
        + "<td class='" + deltaClass(delta) + "'>" + signed(delta) + "</td></tr>";
    }).join("");
    var filters = "";
    if (sess.scope === "school") {
      filters = "<div class='filters'><input name='q' data-action='query' placeholder='Name or admission number' value='" + esc(state.q) + "'>"
        + "<select data-action='filter-form'><option value=''>All forms</option>"
        + [1, 2, 3, 4].map(function (formNo) { return "<option" + (String(state.filterForm) === String(formNo) ? " selected" : "") + ">" + formNo + "</option>"; }).join("")
        + "</select><select data-action='filter-stream'><option value=''>All streams</option>"
        + KBEST.STREAMS.map(function (streamName) { return "<option" + (state.filterStream === streamName ? " selected" : "") + ">" + esc(streamName) + "</option>"; }).join("")
        + "</select></div>";
    } else {
      filters = "<div class='filters'><input data-action='query' placeholder='Search this stream' value='" + esc(state.q) + "'></div>";
    }
    return "<h2>" + (sess.scope === "class" ? "Form " + sess.form + " " + esc(sess.stream) : "School register") + "</h2>"
      + "<p class='who'>" + rows.length + " students shown" + (trimmed ? " of " + matched.length + ". Narrow the search to see a specific student." : ". Open a row to see the full record and write to the guardian.") + "</p>"
      + filters
      + "<div class='table-wrap card' style='padding:8px 12px'><table><thead><tr><th>Pos</th><th>Student</th><th class='hide-sm'>Class</th><th>Latest</th><th>Since entry</th></tr></thead><tbody>"
      + (body || "<tr><td colspan='5'>No student matches that search.</td></tr>")
      + "</tbody></table></div>";
  }

  function staffInbox(sess) {
    var threads = KBEST.threadsForStaff(sess.staffId);
    if (!state.threadAdm && threads[0]) state.threadAdm = threads[0].studentAdm;
    if (state.threadAdm) KBEST.markRead(sess, state.threadAdm, sess.staffId);
    threads = KBEST.threadsForStaff(sess.staffId);
    var list = threads.length ? threads.map(function (thread) {
      var name = thread.student ? thread.student.name : thread.studentAdm;
      return "<button type='button' data-action='thread' data-adm='" + esc(thread.studentAdm) + "' aria-pressed='" + (state.threadAdm === thread.studentAdm) + "'><strong>" + esc(name) + "</strong>" + (thread.unread ? " <span class='badge'>" + thread.unread + "</span>" : "") + "<br><small>" + esc(thread.last.topic) + " · " + esc(when(thread.last.at)) + "</small></button>";
    }).join("") : "<p class='note'>No guardian has written yet. Open a student from the class list to start a thread.</p>";
    var student = KBEST.studentByAdm(state.threadAdm);
    var pane = student ? "<article class='card'><h3>" + esc(student.guardian) + "</h3><p>About " + esc(student.name) + " · " + esc(student.adm) + "</p>" + messagePane(student, sess.staffId, sess) + "</article>" : "<article class='card'><p>Select a conversation.</p></article>";
    return "<div class='messages'><div class='thread-list'>" + list + "</div>" + pane + "</div>";
  }

  function staffPortal(sess) {
    var student = state.studentAdm ? KBEST.studentByAdm(state.studentAdm) : null;
    if (student && sess.scope === "class" && (student.form !== sess.form || student.stream !== sess.stream)) student = null;
    var body;
    if (student) {
      if (!state.form) state.form = student.form;
      if (!state.term) state.term = student.terms[student.terms.length - 1].term;
      var panel = state.tab === "results" ? resultsBlock(student)
        : state.tab === "progress" ? progressBlock(student)
        : state.tab === "messages" ? "<article class='card'><h3>Message " + esc(student.guardian) + "</h3>" + messagePane(student, sess.staffId, sess) + "</article>"
        : overviewBlock(student, sess);
      body = "<p class='no-print'><button class='btn btn-ghost btn-small' type='button' data-action='back'>Back to students</button></p>"
        + "<h2>" + esc(student.name) + "</h2><p class='who'>" + esc(student.adm) + " · Form " + student.form + " " + esc(student.stream) + "</p>"
        + "<div class='tabs no-print'>" + tabButton("overview", "Overview", state.tab) + tabButton("results", "Results", state.tab) + tabButton("progress", "Entry to exit", state.tab) + tabButton("messages", "Message guardian", state.tab) + "</div>"
        + panel;
    } else if (state.tab === "messages") {
      body = staffInbox(sess);
    } else {
      body = staffList(sess);
    }
    var unread = KBEST.unreadCount(sess);
    shell("Staff portal", ""
      + "<section class='wrap page'><div class='portal-head'><div><p class='kicker'>Staff portal</p><h1>" + esc(sess.name) + "</h1><p class='who'>" + esc(sess.roleLabel) + (sess.subject ? " · " + esc(sess.subject) : "") + "</p></div>"
      + "<button class='btn btn-ghost no-print' type='button' data-action='logout'>Sign out</button></div>"
      + "<div class='tabs no-print'>"
      + tabButton("overview", sess.scope === "class" ? "My class" : "Register", state.studentAdm ? "student" : state.tab, "", true)
      + tabButton("messages", "Inbox", state.studentAdm ? "student" : state.tab, unread ? " <span class='badge'>" + unread + "</span>" : "", true)
      + "</div>" + body
      + "<p class='no-print' style='margin-top:18px'><button class='btn btn-danger btn-small' type='button' data-action='reset'>Reset sample messages</button></p></section>");
  }

  function render() {
    var current = route();
    var sess = session();
    if (current === "portal" && !sess) current = "login";
    if (current === "home") homePage();
    else if (current === "academics") academicsPage();
    else if (current === "contact") contactPage();
    else if (current === "login") loginPage();
    else if (sess.kind === "parent") parentPortal(sess);
    else staffPortal(sess);
  }

  function drawChart(canvas) {
    var student = KBEST.studentByAdm(canvas.getAttribute("data-chart"));
    if (!student) return;
    var width = canvas.clientWidth || canvas.parentElement.clientWidth || 640;
    if (width < 40) return;
    var height = 240;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.height = height + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    var pad = { l: 42, r: 14, t: 16, b: 34 };
    var plotW = width - pad.l - pad.r;
    var plotH = height - pad.t - pad.b;
    ctx.strokeStyle = "#e3d8c6";
    ctx.fillStyle = "#4d5c53";
    ctx.font = "12px Outfit, Segoe UI, sans-serif";
    ctx.textAlign = "right";
    [1, 4, 7, 10, 12].forEach(function (point) {
      var y = pad.t + (12 - point) / 11 * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(width - pad.r, y);
      ctx.stroke();
      ctx.fillText(String(point), pad.l - 8, y + 4);
    });
    var terms = student.terms;
    function xAt(index) {
      if (terms.length === 1) return pad.l + plotW / 2;
      return pad.l + (index / (terms.length - 1)) * plotW;
    }
    function yAt(points) {
      return pad.t + (12 - points) / 11 * plotH;
    }
    ctx.beginPath();
    ctx.strokeStyle = "#0e3b2e";
    ctx.lineWidth = 2.4;
    terms.forEach(function (term, index) {
      var x = xAt(index);
      var y = yAt(term.meanPoints);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.textAlign = "center";
    terms.forEach(function (term, index) {
      var x = xAt(index);
      var y = yAt(term.meanPoints);
      ctx.fillStyle = "#b8893d";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4d5c53";
      if (width > 680 || index % 2 === 0) ctx.fillText(term.form + "." + term.term, x, height - 12);
    });
  }

  document.body.addEventListener("click", function (event) {
    var node = event.target.closest("[data-action]");
    if (!node) return;
    var action = node.getAttribute("data-action");
    if (action === "nav") {
      var open = nav.classList.toggle("open");
      node.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (action === "kind") {
      state.loginKind = node.getAttribute("data-kind");
      state.error = "";
      render();
      return;
    }
    if (action === "fill") {
      state.loginKind = node.getAttribute("data-kind");
      state.loginId = node.getAttribute("data-id");
      state.loginPassword = KBEST.DEMO_PASSWORD;
      state.error = "";
      if (location.hash !== "#login") location.hash = "login";
      else render();
      return;
    }
    if (action === "logout") {
      setSession(null);
      state.studentAdm = "";
      state.tab = "overview";
      location.hash = "home";
      return;
    }
    if (action === "tab") {
      state.tab = node.getAttribute("data-tab");
      state.notice = "";
      if (node.getAttribute("data-root") === "1") state.studentAdm = "";
      render();
      return;
    }
    if (action === "form") {
      state.form = Number(node.getAttribute("data-form"));
      state.term = 1;
      render();
      return;
    }
    if (action === "term") {
      state.term = Number(node.getAttribute("data-term"));
      render();
      return;
    }
    if (action === "print") {
      window.print();
      return;
    }
    if (action === "message-teacher") {
      var currentStudent = studentOf(session());
      state.tab = "messages";
      state.channel = currentStudent ? currentStudent.teacherId : state.channel;
      if (session() && session().kind === "staff") state.channel = session().staffId;
      render();
      return;
    }
    if (action === "channel") {
      state.channel = node.getAttribute("data-channel");
      state.notice = "";
      render();
      return;
    }
    if (action === "open-student") {
      state.studentAdm = node.getAttribute("data-adm");
      state.tab = "overview";
      state.form = null;
      state.term = null;
      state.notice = "";
      var opened = KBEST.studentByAdm(state.studentAdm);
      state.channel = session().scope === "class" ? session().staffId : (opened ? opened.teacherId : "");
      render();
      return;
    }
    if (action === "thread") {
      state.threadAdm = node.getAttribute("data-adm");
      state.notice = "";
      render();
      return;
    }
    if (action === "back") {
      state.studentAdm = "";
      state.tab = "overview";
      render();
      return;
    }
    if (action === "reset") {
      KBEST.resetMessages();
      state.notice = "";
      render();
    }
  });

  document.body.addEventListener("submit", function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    var action = form.getAttribute("data-action");
    if (!action) return;
    event.preventDefault();
    if (action === "login") {
      var result = KBEST.authenticate(state.loginKind, form.id.value, form.password.value);
      if (result.error) {
        state.error = result.error;
        state.loginId = form.id.value;
        state.loginPassword = form.password.value;
        render();
        return;
      }
      setSession(result.session);
      state.error = "";
      state.tab = "overview";
      state.studentAdm = "";
      state.form = null;
      state.term = null;
      state.channel = "";
      if ((location.hash || "").replace(/^#\/?/, "") === "portal") render();
      else location.hash = "portal";
      return;
    }
    if (action === "send") {
      var sess = session();
      var data = new FormData(form);
      var sent = KBEST.sendMessage({
        studentAdm: data.get("adm"),
        channel: data.get("channel"),
        sender: sess.kind === "parent" ? "parent" : "staff",
        senderName: sess.name,
        topic: data.get("topic"),
        body: data.get("body")
      });
      state.notice = sent.error || "";
      if (!sent.error) state.threadAdm = data.get("adm");
      render();
    }
  });

  document.body.addEventListener("input", function (event) {
    var node = event.target;
    if (node.getAttribute && node.getAttribute("data-action") === "query") {
      state.q = node.value;
      var start = node.selectionStart;
      render();
      var again = app.querySelector("[data-action='query']");
      if (again) {
        again.focus();
        if (start != null) again.setSelectionRange(start, start);
      }
    }
  });

  document.body.addEventListener("change", function (event) {
    var node = event.target;
    if (!node.getAttribute) return;
    if (node.getAttribute("data-action") === "filter-form") {
      state.filterForm = node.value;
      render();
    }
    if (node.getAttribute("data-action") === "filter-stream") {
      state.filterStream = node.value;
      render();
    }
  });

  document.body.addEventListener("click", function (event) {
    if (event.target.closest("a[href^='#']")) nav.classList.remove("open");
  });

  window.addEventListener("hashchange", render);
  window.addEventListener("resize", function () {
    var canvas = app.querySelector("canvas[data-chart]");
    if (canvas) drawChart(canvas);
  });
  render();
})();
