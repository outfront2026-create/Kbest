/* KBEST school register, results, and portal messages.
   Sample records are generated in the browser so the site can run
   on GitHub Pages with no server and no build step. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.KBEST = api;
  if (typeof process !== "undefined" && process.argv && process.argv.indexOf("--check") !== -1 && typeof module !== "undefined" && require.main === module) {
    var school = api.getSchool();
    var brian = api.studentByAdm("KBEST-4N-001");
    var south = api.studentByAdm("KBEST-2S-010");
    var east = api.studentByAdm("KBEST-1E-003");
    var counts = {};
    school.students.forEach(function (student) {
      var key = student.form + student.stream;
      counts[key] = (counts[key] || 0) + 1;
      if (student.streamSize > 50) throw new Error("Stream over 50: " + key);
      if (student.terms[0].form !== 1) throw new Error("Missing Form 1 entry for " + student.adm);
      if (student.terms[student.terms.length - 1].form !== student.form) throw new Error("Latest form mismatch " + student.adm);
    });
    if (school.students.length < 700) throw new Error("Register too small");
    if (!brian || brian.name !== "Brian Njeru" || brian.teacherId !== "CT-4N") throw new Error("Demo student mismatch");
    if (!south || south.form !== 2 || south.stream !== "South") throw new Error("South demo mismatch");
    if (!east || east.form !== 1 || east.stream !== "East") throw new Error("East demo mismatch");
    var parent = api.authenticate("parent", "kbest-4n-001", api.DEMO_PASSWORD);
    var teacher = api.authenticate("staff", "ct-4n", "CT-4N");
    var bad = api.authenticate("parent", "KBEST-4N-001", "wrong-password");
    if (!parent.session || parent.session.studentAdm !== "KBEST-4N-001") throw new Error("Parent login failed");
    if (!teacher.session || teacher.session.staffId !== "CT-4N") throw new Error("Teacher login failed");
    if (!bad.error) throw new Error("Bad password was accepted");
    Object.keys(counts).forEach(function (key) {
      if (counts[key] > 50) throw new Error(key + " has " + counts[key]);
    });
    console.log("KBEST check ok:", school.students.length, "students;", Object.keys(api.CLASS_TEACHERS).length, "class teachers; Brian", brian.latestGrade, "pos", brian.position + "/" + brian.streamSize);
  }
})(typeof self !== "undefined" ? self : this, function () {
  var DEMO_PASSWORD = "kbest2026";
  var ALLOW_ID_AS_PASSWORD = true;
  var STREAMS = ["North", "South", "West", "East"];
  var STREAM_SIZE = { North: 50, South: 48, West: 46, East: 45 };
  var CURRENT_YEAR = 2026;

  var FIRST = [
    "Brian", "Kevin", "Dennis", "Samuel", "Peter", "James", "David", "Emmanuel",
    "Felix", "Collins", "Victor", "Eric", "Daniel", "Joseph", "Moses", "Isaac",
    "Caleb", "Gideon", "Allan", "Martin", "Stephen", "Francis", "Patrick", "John",
    "Paul", "Timothy", "Nicholas", "Andrew", "Benjamin", "Simon", "Geoffrey",
    "Kennedy", "Evans", "Boniface", "Dominic", "Edwin", "Fredrick", "George",
    "Henry", "Ian", "Lawrence", "Mark", "Nathan", "Oscar", "Pius", "Robert",
    "Solomon", "Titus", "Wilson", "Alex", "Chris", "Duncan"
  ];
  var LAST = [
    "Njeru", "Njagi", "Nyaga", "Mutegi", "Ndwiga", "Kinyua", "Ireri", "Mugo",
    "Kathuri", "Njoka", "Nthiga", "Muriithi", "Ngari", "Kivuti", "Njue", "Mbaka",
    "Murimi", "Mucira", "Njiru", "Kariuki", "Mwangi", "Otieno", "Wanjala", "Kamau",
    "Maina", "Ochieng", "Kimani", "Cheruiyot", "Barasa", "Were"
  ];

  var CLASS_TEACHERS = {
    "1N": { id: "CT-1N", name: "Mr. Peter Ndwiga", subject: "English", form: 1, stream: "North" },
    "1S": { id: "CT-1S", name: "Ms. Grace Mutegi", subject: "Kiswahili", form: 1, stream: "South" },
    "1W": { id: "CT-1W", name: "Mr. David Kinyua", subject: "Mathematics", form: 1, stream: "West" },
    "1E": { id: "CT-1E", name: "Ms. Ruth Ireri", subject: "Biology", form: 1, stream: "East" },
    "2N": { id: "CT-2N", name: "Mr. Stephen Nyaga", subject: "Geography", form: 2, stream: "North" },
    "2S": { id: "CT-2S", name: "Mr. Collins Mugo", subject: "History and Government", form: 2, stream: "South" },
    "2W": { id: "CT-2W", name: "Ms. Faith Kathuri", subject: "Chemistry", form: 2, stream: "West" },
    "2E": { id: "CT-2E", name: "Mr. Victor Njoka", subject: "Christian Religious Education", form: 2, stream: "East" },
    "3N": { id: "CT-3N", name: "Mr. Henry Nthiga", subject: "Physics", form: 3, stream: "North" },
    "3S": { id: "CT-3S", name: "Ms. Lucy Muriithi", subject: "Agriculture", form: 3, stream: "South" },
    "3W": { id: "CT-3W", name: "Mr. Nicholas Wanjala", subject: "Business Studies", form: 3, stream: "West" },
    "3E": { id: "CT-3E", name: "Mr. Edwin Otieno", subject: "Computer Studies", form: 3, stream: "East" },
    "4N": { id: "CT-4N", name: "Mr. Samuel Kariuki", subject: "Mathematics", form: 4, stream: "North" },
    "4S": { id: "CT-4S", name: "Ms. Ann Njiru", subject: "English", form: 4, stream: "South" },
    "4W": { id: "CT-4W", name: "Mr. Moses Mbaka", subject: "Chemistry", form: 4, stream: "West" },
    "4E": { id: "CT-4E", name: "Mr. Timothy Kivuti", subject: "Biology", form: 4, stream: "East" }
  };

  var LEADERSHIP = [
    { id: "PRINCIPAL", name: "Mr. Francis Murimi", title: "Principal", scope: "school" },
    { id: "DEPUTY", name: "Mr. Daniel Mucira", title: "Deputy Principal, Academics", scope: "school" },
    { id: "DEAN", name: "Mr. Joseph Njue", title: "Dean of Students", scope: "school" }
  ];

  var TOPICS = [
    "Academic progress",
    "Discipline and welfare",
    "Boarding matters",
    "Absence",
    "General"
  ];

  var CORE = ["English", "Kiswahili", "Mathematics"];
  var SCI = ["Biology", "Chemistry", "Physics"];
  var HUM = ["History and Government", "Geography", "Christian Religious Education"];
  var APP = ["Agriculture", "Business Studies", "Computer Studies"];

  var cache = null;

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function avg(list) {
    if (!list.length) return 0;
    return list.reduce(function (sum, n) { return sum + n; }, 0) / list.length;
  }

  function pickN(arr, n, rnd) {
    var copy = arr.slice();
    var out = [];
    while (out.length < n && copy.length) {
      out.push(copy.splice(Math.floor(rnd() * copy.length), 1)[0]);
    }
    return out;
  }

  function markBand(score) {
    var bands = [
      [80, 12, "A", "Excellent"],
      [75, 11, "A-", "Excellent"],
      [70, 10, "B+", "Very good"],
      [65, 9, "B", "Very good"],
      [60, 8, "B-", "Good"],
      [55, 7, "C+", "Good"],
      [50, 6, "C", "Satisfactory"],
      [45, 5, "C-", "Satisfactory"],
      [40, 4, "D+", "Below expectation"],
      [35, 3, "D", "Below expectation"],
      [30, 2, "D-", "Needs support"],
      [0, 1, "E", "Needs urgent support"]
    ];
    for (var i = 0; i < bands.length; i++) {
      if (score >= bands[i][0]) {
        return { points: bands[i][1], grade: bands[i][2], remark: bands[i][3] };
      }
    }
    return { points: 1, grade: "E", remark: "Needs urgent support" };
  }

  function gradeFromPoints(points) {
    var bands = [
      [11.5, "A"], [10.5, "A-"], [9.5, "B+"], [8.5, "B"], [7.5, "B-"],
      [6.5, "C+"], [5.5, "C"], [4.5, "C-"], [3.5, "D+"], [2.5, "D"],
      [1.5, "D-"], [0, "E"]
    ];
    for (var i = 0; i < bands.length; i++) {
      if (points >= bands[i][0]) return bands[i][1];
    }
    return "E";
  }

  function teacherRemark(grade, first) {
    var lines = {
      A: first + " has produced excellent work this term and should protect this standard.",
      "A-": first + " is working at a high standard. Consistency will hold the grade.",
      "B+": first + " is doing very good work. A little more precision will lift the mean.",
      B: first + " has a solid term. Targeted revision in weaker subjects will help.",
      "B-": first + " is on a good path. Classwork and corrections need to stay regular.",
      "C+": first + " is making steady progress. Extra practice in weaker papers is needed.",
      C: first + " has a satisfactory term. A clear study plan will move the mean up.",
      "C-": first + " is just below the class target. Attend clinics and finish corrections.",
      "D+": first + " needs a firmer routine. The class teacher will follow up on weak subjects.",
      D: first + " is below expectation. Please support daily revision at home.",
      "D-": first + " needs close academic support this term.",
      E: first + " needs urgent academic support. Kindly speak with the class teacher."
    };
    return lines[grade] || lines.C;
  }

  function streamLetter(stream) {
    return stream.charAt(0);
  }

  function admissionOf(form, stream, index) {
    var n = String(index).padStart(3, "0");
    return "KBEST-" + form + streamLetter(stream) + "-" + n;
  }

  function entryYear(form) {
    return CURRENT_YEAR - (form - 1);
  }

  function buildStudent(form, stream, index, rnd, usedNames) {
    var first;
    var last;
    if (form === 4 && stream === "North" && index === 1) {
      first = "Brian";
      last = "Njeru";
      usedNames["Brian Njeru"] = true;
    } else {
      first = FIRST[Math.floor(rnd() * FIRST.length)];
      last = LAST[Math.floor(rnd() * LAST.length)];
      var guard = 0;
      while (usedNames[first + " " + last] && guard < 12) {
        first = FIRST[Math.floor(rnd() * FIRST.length)];
        last = LAST[Math.floor(rnd() * LAST.length)];
        guard++;
      }
      if (usedNames[first + " " + last]) last = last + " " + streamLetter(stream) + index;
      usedNames[first + " " + last] = true;
    }

    var key = form + streamLetter(stream);
    var teacher = CLASS_TEACHERS[key];
    var featured = form === 4 && stream === "North" && index === 1;
    var subjects = featured
      ? ["English", "Kiswahili", "Mathematics", "Biology", "Chemistry", "History and Government", "Geography", "Agriculture"]
      : CORE.concat(pickN(SCI, 2, rnd), pickN(HUM, 2, rnd), pickN(APP, 1, rnd));
    var base = featured ? 71 : 52 + rnd() * 24;
    var growth = 0.28 + rnd() * 0.7;
    var profiles = subjects.map(function (name) {
      return { name: name, bias: (rnd() - 0.48) * 16, wave: rnd() * 6 };
    });

    var terms = [];
    var termIndex = 0;
    for (var f = 1; f <= form; f++) {
      var lastTerm = f === form ? 3 : 3;
      for (var term = 1; term <= lastTerm; term++) {
        var isMidterm = f === form && term === 3;
        var rows = profiles.map(function (profile) {
          var raw = base + profile.bias + growth * termIndex + Math.sin(profile.wave + termIndex) * 2.4 + (rnd() - 0.5) * 7;
          if (featured && profile.name === "Chemistry") raw -= 16;
          if (featured && profile.name !== "Chemistry") raw += 4;
          var score = Math.round(clamp(raw, 22, 96));
          var band = markBand(score);
          return {
            name: profile.name,
            score: score,
            grade: band.grade,
            points: band.points,
            remark: band.remark
          };
        });
        rows.sort(function (a, b) { return a.name.localeCompare(b.name); });
        var meanPoints = avg(rows.map(function (row) { return row.points; }));
        var meanScore = avg(rows.map(function (row) { return row.score; }));
        var meanGrade = gradeFromPoints(meanPoints);
        var conductRoll = rnd();
        terms.push({
          form: f,
          term: term,
          year: entryYear(form) + (f - 1),
          kind: isMidterm ? "midterm" : "endterm",
          label: "Form " + f + " · Term " + term + (isMidterm ? " · Midterm" : ""),
          subjects: rows,
          meanPoints: meanPoints,
          meanScore: meanScore,
          meanGrade: meanGrade,
          conduct: conductRoll > 0.9 ? "B" : "A",
          attendance: Math.round((91 + rnd() * 8) * 10) / 10,
          remark: teacherRemark(meanGrade, first)
        });
        termIndex++;
      }
    }

    var latest = terms[terms.length - 1];
    var entry = terms[0];
    return {
      adm: admissionOf(form, stream, index),
      first: first,
      last: last,
      name: first + " " + last,
      guardian: "Mr. and Mrs. " + last,
      form: form,
      stream: stream,
      streamKey: key,
      teacherId: teacher.id,
      teacherName: teacher.name,
      subjects: subjects,
      terms: terms,
      entryPoints: entry.meanPoints,
      entryGrade: entry.meanGrade,
      latestPoints: latest.meanPoints,
      latestGrade: latest.meanGrade,
      entryYear: entryYear(form)
    };
  }

  function buildSchool() {
    var rnd = mulberry32(0x4b424553);
    var usedNames = {};
    var students = [];
    for (var form = 1; form <= 4; form++) {
      STREAMS.forEach(function (stream) {
        var size = STREAM_SIZE[stream];
        for (var i = 1; i <= size; i++) students.push(buildStudent(form, stream, i, rnd, usedNames));
      });
    }

    var groups = {};
    students.forEach(function (student) {
      var key = student.form + "|" + student.stream;
      if (!groups[key]) groups[key] = [];
      groups[key].push(student);
    });
    Object.keys(groups).forEach(function (key) {
      var list = groups[key].slice().sort(function (a, b) {
        return b.latestPoints - a.latestPoints || a.name.localeCompare(b.name);
      });
      var streamAverage = avg(list.map(function (student) { return student.latestPoints; }));
      var position = 0;
      var lastPoints = null;
      list.forEach(function (student, index) {
        if (lastPoints === null || Math.abs(student.latestPoints - lastPoints) > 0.001) position = index + 1;
        lastPoints = student.latestPoints;
        student.position = position;
        student.streamSize = list.length;
        student.streamAverage = streamAverage;
      });
    });

    var byAdm = {};
    students.forEach(function (student) { byAdm[student.adm] = student; });
    return { students: students, byAdm: byAdm };
  }

  function getSchool() {
    if (!cache) cache = buildSchool();
    return cache;
  }

  function studentByAdm(adm) {
    if (!adm) return null;
    return getSchool().byAdm[String(adm).trim().toUpperCase()] || null;
  }

  function classList(form, stream) {
    return getSchool().students
      .filter(function (student) { return student.form === form && student.stream === stream; })
      .sort(function (a, b) { return a.position - b.position || a.name.localeCompare(b.name); });
  }

  function searchStudents(query, form, stream) {
    var q = String(query || "").trim().toLowerCase();
    return getSchool().students.filter(function (student) {
      if (form && student.form !== Number(form)) return false;
      if (stream && student.stream !== stream) return false;
      if (!q) return true;
      return student.adm.toLowerCase().indexOf(q) !== -1 || student.name.toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) {
      return a.form - b.form || a.stream.localeCompare(b.stream) || a.position - b.position;
    });
  }

  function staffById(id) {
    var key = String(id || "").trim().toUpperCase();
    var classIds = Object.keys(CLASS_TEACHERS);
    for (var i = 0; i < classIds.length; i++) {
      var teacher = CLASS_TEACHERS[classIds[i]];
      if (teacher.id === key) {
        return {
          id: teacher.id,
          name: teacher.name,
          title: "Class teacher, Form " + teacher.form + " " + teacher.stream,
          subject: teacher.subject,
          form: teacher.form,
          stream: teacher.stream,
          scope: "class"
        };
      }
    }
    for (var j = 0; j < LEADERSHIP.length; j++) {
      if (LEADERSHIP[j].id === key) return LEADERSHIP[j];
    }
    return null;
  }

  function passwordOk(id, password) {
    var typed = String(password || "").trim();
    if (!typed) return false;
    if (typed === DEMO_PASSWORD) return true;
    if (ALLOW_ID_AS_PASSWORD && typed.toUpperCase() === String(id).toUpperCase()) return true;
    return false;
  }

  function authenticate(kind, id, password) {
    var clean = String(id || "").trim().toUpperCase();
    if (!clean || !String(password || "").trim()) {
      return { error: "Enter both the ID and the password." };
    }
    if (kind === "parent") {
      var student = studentByAdm(clean);
      if (!student) return { error: "That admission number is not on the KBEST register." };
      if (!passwordOk(clean, password)) return { error: "The password does not match this admission number." };
      return {
        session: {
          kind: "parent",
          studentAdm: student.adm,
          name: student.guardian,
          roleLabel: "Parent or guardian"
        }
      };
    }
    var staff = staffById(clean);
    if (!staff) return { error: "That staff ID is not on the KBEST directory." };
    if (!passwordOk(clean, password)) return { error: "The password does not match this staff ID." };
    return {
      session: {
        kind: "staff",
        staffId: staff.id,
        name: staff.name,
        roleLabel: staff.title,
        form: staff.form || null,
        stream: staff.stream || null,
        scope: staff.scope,
        subject: staff.subject || ""
      }
    };
  }

  function store() {
    try {
      if (typeof localStorage !== "undefined") return localStorage;
    } catch (err) { /* private mode */ }
    if (!store.memory) {
      store.memory = {
        bag: {},
        getItem: function (key) { return Object.prototype.hasOwnProperty.call(this.bag, key) ? this.bag[key] : null; },
        setItem: function (key, value) { this.bag[key] = String(value); },
        removeItem: function (key) { delete this.bag[key]; }
      };
    }
    return store.memory;
  }

  function seedMessages() {
    var brian = studentByAdm("KBEST-4N-001");
    var south = studentByAdm("KBEST-2S-010");
    return [
      {
        id: "seed-1",
        studentAdm: brian.adm,
        channel: "CT-4N",
        sender: "parent",
        senderName: brian.guardian,
        topic: "Academic progress",
        body: "Good evening, Mr. Kariuki. Kindly update us on how Brian is preparing for the KCSE practicals, and which papers need more time at home.",
        at: "2026-09-28T16:10:00.000Z",
        readBy: ["parent"]
      },
      {
        id: "seed-2",
        studentAdm: brian.adm,
        channel: "CT-4N",
        sender: "staff",
        senderName: "Mr. Samuel Kariuki",
        topic: "Academic progress",
        body: "Thank you. Brian is steady in Mathematics and English. Chemistry practicals need more practice on titration and qualitative analysis. I have booked him into the Thursday clinic at 4.30pm. His latest midterm mean is on the portal.",
        at: "2026-09-29T07:40:00.000Z",
        readBy: ["CT-4N"]
      },
      {
        id: "seed-3",
        studentAdm: south.adm,
        channel: "CT-2S",
        sender: "parent",
        senderName: south.guardian,
        topic: "Absence",
        body: "Our son will miss lessons on Monday 5 October for a hospital review. He will bring the note when he returns on Tuesday.",
        at: "2026-10-02T18:05:00.000Z",
        readBy: ["parent"]
      }
    ];
  }

  function loadMessages() {
    var raw = store().getItem("kbest.messages.v1");
    if (!raw) {
      var seeded = seedMessages();
      saveMessages(seeded);
      return seeded;
    }
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : seedMessages();
    } catch (err) {
      return seedMessages();
    }
  }

  function saveMessages(list) {
    store().setItem("kbest.messages.v1", JSON.stringify(list));
  }

  function resetMessages() {
    var seeded = seedMessages();
    saveMessages(seeded);
    return seeded;
  }

  function messagesFor(studentAdm, channel) {
    return loadMessages()
      .filter(function (message) {
        return message.studentAdm === studentAdm && (!channel || message.channel === channel);
      })
      .sort(function (a, b) { return a.at < b.at ? -1 : 1; });
  }

  function threadsForStaff(staffId) {
    var grouped = {};
    loadMessages().forEach(function (message) {
      if (message.channel !== staffId) return;
      if (!grouped[message.studentAdm]) grouped[message.studentAdm] = [];
      grouped[message.studentAdm].push(message);
    });
    return Object.keys(grouped).map(function (adm) {
      var items = grouped[adm].sort(function (a, b) { return a.at < b.at ? -1 : 1; });
      var student = studentByAdm(adm);
      var unread = items.filter(function (message) {
        return message.sender === "parent" && message.readBy.indexOf(staffId) === -1;
      }).length;
      return {
        studentAdm: adm,
        student: student,
        last: items[items.length - 1],
        unread: unread
      };
    }).sort(function (a, b) { return a.last.at < b.last.at ? 1 : -1; });
  }

  function unreadCount(session) {
    if (!session) return 0;
    var messages = loadMessages();
    if (session.kind === "parent") {
      return messages.filter(function (message) {
        return message.studentAdm === session.studentAdm && message.sender === "staff" && message.readBy.indexOf("parent") === -1;
      }).length;
    }
    return messages.filter(function (message) {
      return message.channel === session.staffId && message.sender === "parent" && message.readBy.indexOf(session.staffId) === -1;
    }).length;
  }

  function markRead(session, studentAdm, channel) {
    var key = session.kind === "parent" ? "parent" : session.staffId;
    var messages = loadMessages();
    var changed = false;
    messages.forEach(function (message) {
      if (message.studentAdm !== studentAdm || message.channel !== channel) return;
      if (message.readBy.indexOf(key) !== -1) return;
      message.readBy.push(key);
      changed = true;
    });
    if (changed) saveMessages(messages);
  }

  function sendMessage(input) {
    var body = String(input.body || "").trim();
    var topic = TOPICS.indexOf(input.topic) === -1 ? "General" : input.topic;
    if (body.length < 2) return { error: "Write a short message before sending." };
    if (body.length > 1000) return { error: "Keep the message within 1,000 characters." };
    var student = studentByAdm(input.studentAdm);
    if (!student) return { error: "Student record not found." };
    var staff = staffById(input.channel);
    if (!staff) return { error: "Choose a member of staff." };
    if (staff.scope === "class" && (staff.form !== student.form || staff.stream !== student.stream)) {
      return { error: "That class teacher does not take this stream." };
    }
    var message = {
      id: "m-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1000),
      studentAdm: student.adm,
      channel: staff.id,
      sender: input.sender,
      senderName: input.senderName,
      topic: topic,
      body: body,
      at: new Date().toISOString(),
      readBy: [input.sender === "parent" ? "parent" : input.channel]
    };
    var all = loadMessages();
    all.push(message);
    saveMessages(all);
    return { ok: true, message: message };
  }

  function recipientsFor(student) {
    var classTeacher = staffById(student.teacherId);
    return [classTeacher].concat(LEADERSHIP);
  }

  function latestSubjectsRanked(student) {
    var latest = student.terms[student.terms.length - 1];
    return latest.subjects.slice().sort(function (a, b) { return b.points - a.points || b.score - a.score; });
  }

  function yearSummaries(student) {
    var buckets = {};
    student.terms.forEach(function (term) {
      if (!buckets[term.form]) buckets[term.form] = [];
      buckets[term.form].push(term);
    });
    return Object.keys(buckets).map(function (form) {
      var terms = buckets[form];
      var points = avg(terms.map(function (term) { return term.meanPoints; }));
      return {
        form: Number(form),
        year: terms[0].year,
        meanPoints: points,
        meanGrade: gradeFromPoints(points),
        assessments: terms.length
      };
    });
  }

  function narrative(student) {
    var delta = student.latestPoints - student.entryPoints;
    var path = delta > 0.45 ? "an upward path" : delta < -0.45 ? "a dip that needs attention" : "a steady path";
    var ranked = latestSubjectsRanked(student);
    var best = ranked[0];
    var weak = ranked[ranked.length - 1];
    var change = (delta > 0 ? "+" : "") + delta.toFixed(2);
    var journey = student.form === 4 ? "from Form 1 entry to the Form 4 exit year" : "from Form 1 entry to the current form";
    return student.first + " joined KBEST in " + student.entryYear + " (" + journey + ") with an entry mean of " +
      student.entryGrade + ". The record shows " + path + ". The latest mean is " + student.latestGrade +
      " (" + student.latestPoints.toFixed(2) + " points), a change of " + change +
      " points from entry. Strongest paper now: " + best.name + " (" + best.grade + "). Paper needing most support: " +
      weak.name + " (" + weak.grade + ").";
  }

  function termBy(student, form, term) {
    for (var i = 0; i < student.terms.length; i++) {
      if (student.terms[i].form === Number(form) && student.terms[i].term === Number(term)) return student.terms[i];
    }
    return student.terms[student.terms.length - 1];
  }

  return {
    DEMO_PASSWORD: DEMO_PASSWORD,
    STREAMS: STREAMS,
    STREAM_SIZE: STREAM_SIZE,
    CLASS_TEACHERS: CLASS_TEACHERS,
    LEADERSHIP: LEADERSHIP,
    TOPICS: TOPICS,
    CURRENT_YEAR: CURRENT_YEAR,
    getSchool: getSchool,
    studentByAdm: studentByAdm,
    classList: classList,
    searchStudents: searchStudents,
    staffById: staffById,
    authenticate: authenticate,
    loadMessages: loadMessages,
    resetMessages: resetMessages,
    messagesFor: messagesFor,
    threadsForStaff: threadsForStaff,
    unreadCount: unreadCount,
    markRead: markRead,
    sendMessage: sendMessage,
    recipientsFor: recipientsFor,
    yearSummaries: yearSummaries,
    narrative: narrative,
    termBy: termBy,
    gradeFromPoints: gradeFromPoints,
    admissionOf: admissionOf
  };
});
