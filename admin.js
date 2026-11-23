const KEY="myzen_separate_demo_v1";
let db=JSON.parse(localStorage.getItem(KEY)||"null")||{users:[],transactions:[],deposits:[],current:null};
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=(n,c)=>new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(n)+" "+c;
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
function guard(){if(sessionStorage.getItem("myzen_admin_authenticated")!=="yes"){location.replace("admin-login.html");return false}return true}
function render(){if(!guard())return;const customers=db.users.filter(u=>u.role!=="admin"),pending=customers.filter(u=>u.status==="pending"),approved=customers.filter(u=>u.status==="approved"),deposits=db.deposits.filter(d=>d.status==="pending");
$("totalUsers").textContent=customers.length;$("pendingUsers").textContent=pending.length;$("approvedUsers").textContent=approved.length;$("pendingDeposits").textContent=deposits.length;
$("userRequests").innerHTML=pending.map(u=>`<div class="admin-row"><div><b>${esc(u.name)}</b><br><small>Email: ${esc(u.email)} · Phone: ${esc(u.phone)} · NRC: ${esc(u.nrc)}</small><br><small>Registered account · ${esc(u.walletId)}</small></div><div class="admin-actions"><button class="approve" data-approve="${u.id}">Approve</button><button class="reject" data-reject="${u.id}">Reject</button></div></div>`).join("")||'<div class="empty">No pending registrations.</div>';
$("depositRequests").innerHTML=deposits.map(d=>`<div class="admin-row"><div><b>${esc(d.userName)} · ${money(d.amount,d.currency)}</b><br><small>Method: ${esc(d.method)} · Reference: ${esc(d.ref)}</small><br><small>${new Date(d.time).toLocaleString()}</small></div><div class="admin-actions"><button class="approve" data-deposit-approve="${d.id}">Approve</button><button class="reject" data-deposit-reject="${d.id}">Reject</button></div></div>`).join("")||'<div class="empty">No pending deposit requests.</div>'}
$("userRequests").addEventListener("click",e=>{const id=e.target.dataset.approve||e.target.dataset.reject;if(!id)return;const user=db.users.find(u=>u.id===id);if(!user)return;user.status=e.target.dataset.approve?"approved":"rejected";save();render();toast("Customer "+user.status+".")});
$("depositRequests").addEventListener("click",e=>{const id=e.target.dataset.depositApprove||e.target.dataset.depositReject;if(!id)return;const d=db.deposits.find(x=>x.id===id);if(!d)return;d.status=e.target.dataset.depositApprove?"approved":"rejected";if(d.status==="approved"){const user=db.users.find(u=>u.id===d.userId);if(user){user.balance=Number(user.balance||0)+(d.currency==="THB"?d.amount:d.amount/700)}db.transactions.push({id:crypto.randomUUID(),type:"deposit",from:"admin",to:d.userId,title:"Deposit approved",amount:d.amount,currency:d.currency,note:d.ref,time:Date.now()})}save();render();toast("Deposit "+d.status+".")});
$("refreshAdmin").addEventListener("click",()=>{db=JSON.parse(localStorage.getItem(KEY)||"null");render();toast("Admin data refreshed.")});
$("adminLogout").addEventListener("click",()=>{sessionStorage.removeItem("myzen_admin_authenticated");location.href="admin-login.html"});
render();
