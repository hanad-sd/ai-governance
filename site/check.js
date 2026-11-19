(function(){
  var NAME=(window.SITE&&window.SITE.name)||"Answerable";
  var Q=[
    {id:"use",theme:"Use",text:"Is anyone in your organisation using AI tools today?",opts:[
      ["known","Yes, and leadership knows about it"],["own","Probably. Staff use it on their own"],["none","Not that we know of"],["unsure","We are not sure"]]},
    {id:"plan",theme:"Use",text:"Do you expect to start using AI tools in the next year?",show:function(a){return a.use==="none"},opts:[
      ["yes","Yes"],["maybe","Maybe"],["no","No"]]},
    {id:"what",theme:"Use",text:"What is it used for? Choose all that apply.",many:true,show:function(a){return a.use!=="none"},opts:[
      ["writing","Writing, email and documents"],["notes","Summarising notes or meetings"],["clients","Work that involves customer, client, donor or member information"],["hiring","Hiring or screening applicants"],["decisions","Decisions about people: credit, eligibility, pricing or who gets a service"],["unknown","We do not know"]]},
    {id:"data",theme:"Exposure",text:"Does personal or confidential information go into those tools?",show:function(a){return a.use!=="none"},opts:[
      ["yes","Yes"],["no","No"],["unsure","We are not sure"]]},
    {id:"rule",theme:"Control",text:"Do you have a written rule for how staff may use AI?",opts:[
      ["yes","Yes, adopted"],["draft","A draft, not adopted"],["no","No"]]},
    {id:"owner",theme:"Control",text:"Is one named person responsible for how AI is used?",opts:[
      ["yes","Yes"],["no","No"]]},
    {id:"approve",theme:"Control",text:"Does someone approve a new AI tool before staff start using it?",opts:[
      ["yes","Yes, always"],["some","Sometimes"],["no","No"]]},
    {id:"asked",theme:"Pressure",text:"Has a board member, auditor, regulator, client, funder or insurer asked how you use AI?",opts:[
      ["yes","Yes"],["soon","Not yet, but we expect it"],["no","No"]]}
  ];
  var PATHS={
    start:{name:"Start well",service:"a one-page staff rule on which tools may be used, with what information",body:"You are early, which is the easiest time to set good habits. Agree simple, shared rules before tools arrive, and decide where AI could help and where it should stay out."},
    review:{name:"Find what you have",service:"an AI use inventory: each tool, its purpose, the information it touches and its owner",body:"You do not yet have a clear picture of where AI is used or what it touches. That comes first. You cannot tier risk or set controls for tools nobody has listed."},
    guide:{name:"Write it down",service:"a written AI use guideline, adopted by leadership, with risk tiers for higher-impact uses",body:"You know AI is in use, and there is no adopted rule for it. A written guideline gives staff clear limits and gives leadership something to adopt and to answer for."},
    advise:{name:"Keep it working",service:"a review cycle: inventory kept current, approvals logged, controls tested",body:"You have a written rule. The work now is keeping it real: a named owner, an approval step for new tools, training for new staff, and evidence that the controls work."}
  };
  var a={},order=[],pos=0,el=document.getElementById("tool");

  function visible(){return Q.filter(function(q){return !q.show||q.show(a)})}
  function decide(a){
    if(a.use==="none")return "start";
    var w=a.what||[];
    if(a.use==="own"||a.use==="unsure"||a.data==="unsure"||w.indexOf("unknown")>-1)return "review";
    if(a.rule!=="yes")return "guide";
    return "advise";
  }
  function flags(a){
    var f=[],w=a.what||[];
    if(w.indexOf("decisions")>-1)f.push("AI is involved in decisions about people. Keep a named person responsible for every one of those decisions. A review would look here first.");
    if(w.indexOf("hiring")>-1)f.push("You use AI in hiring. Since January 1, 2026, Ontario employers with 25 or more employees must say so in publicly advertised job postings. Ask your employment counsel how it applies to you.");
    if(a.data==="yes")f.push("Personal or confidential information is going into AI tools. Depending on your sector and province, privacy law may apply to it whatever tool holds it. Check with your counsel.");
    if(a.owner==="no")f.push("Nobody is named as responsible. Naming one person is the cheapest step you can take this week.");
    if(a.asked==="yes")f.push("Someone has already asked. A short written summary gives you an answer you can stand behind.");
    return f;
  }
  function heard(a){
    var out=[];
    Q.forEach(function(q){
      var v=a[q.id]; if(v===undefined)return;
      var picked=q.opts.filter(function(o){return q.many?v.indexOf(o[0])>-1:v===o[0]}).map(function(o){return o[1]});
      if(!picked.length)return;
      out.push(q.text.replace(" Choose all that apply.","")+" "+picked.join("; ")+(/[.?!]$/.test(picked[picked.length-1])?"":"."));
    });
    return out;
  }
  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")}

  function clearSummary(){
    var f=document.getElementById("f-summary"),r=document.getElementById("summary-row");
    if(f)f.value="";if(r)r.hidden=true;
  }
  function renderQ(){
    clearSummary();
    order=visible();
    if(pos>=order.length){return renderR()}
    var q=order[pos],cur=a[q.id],h='<div class="step">'+q.theme+' · question '+(pos+1)+' of '+order.length+'</div>'+
      '<div class="track"><i style="width:'+Math.round(pos/order.length*100)+'%"></i></div><fieldset><legend>'+esc(q.text)+'</legend>';
    q.opts.forEach(function(o,i){
      var on=q.many?(cur||[]).indexOf(o[0])>-1:cur===o[0];
      h+='<label class="opt"><input type="'+(q.many?"checkbox":"radio")+'" name="q" id="opt-'+q.id+'-'+i+'" value="'+o[0]+'"'+(on?" checked":"")+'><span>'+esc(o[1])+'</span></label>';
    });
    h+='</fieldset><div class="row"><button type="button" id="next">'+(pos===order.length-1?"See where you stand":"Next")+'</button>'+(pos>0?'<button type="button" class="ghost" id="back">Back</button>':'')+'</div>';
    el.innerHTML=h;
    var next=document.getElementById("next");
    function read(){
      var ins=el.querySelectorAll("input:checked"),v=[].map.call(ins,function(i){return i.value});
      if(q.many){a[q.id]=v}else if(v.length){a[q.id]=v[0]}
      next.disabled=!v.length;
    }
    read();
    el.querySelector("fieldset").addEventListener("change",read);
    next.addEventListener("click",function(){read();if(next.disabled)return;
      Q.forEach(function(x){if(x.show&&!x.show(a))delete a[x.id]});
      pos++;renderQ();});
    var back=document.getElementById("back");
    if(back)back.addEventListener("click",function(){pos--;renderQ()});
  }
  function renderR(){
    var p=PATHS[decide(a)],hs=heard(a),fs=flags(a);
    var h='<div class="step">Where you stand</div><h3>What you told me</h3><ul class="plain heard">'+hs.map(function(s){return "<li>"+esc(s)+"</li>"}).join("")+'</ul>'+
      '<div class="path"><h3>'+p.name+'</h3><p>'+p.body+'</p><p><strong>Suggested first step:</strong> '+p.service+'.</p></div>';
    if(fs.length)h+='<h3>Worth your attention</h3><ul class="plain heard">'+fs.map(function(s){return "<li>"+esc(s)+"</li>"}).join("")+'</ul>';
    h+='<p class="small muted">Nothing has been sent. You can send this summary to me for a reply, or copy it to share with whoever decides.</p>'+
      '<div class="row"><button type="button" id="send">Send this to me</button><button type="button" class="ghost" id="copy">Copy summary</button><button type="button" class="ghost" id="again">Start again</button></div><div id="copied" role="status"></div>';
    el.innerHTML=h;
    var text="AI self-check summary ("+NAME+")\n\nWhat you told the check:\n- "+hs.join("\n- ")+"\n\nResult: "+p.name+"\n"+p.body+"\nSuggested first step: "+p.service+"."+(fs.length?"\n\nWorth attention:\n- "+fs.join("\n- "):"")+"\n\nThis is a starting point for a conversation. It is not an audit, a compliance finding or legal advice.";
    document.getElementById("copy").addEventListener("click",function(){
      var note=document.getElementById("copied");
      try{navigator.clipboard.writeText(text).then(function(){note.textContent="Copied. Paste it into an email or a document."},function(){fallback()})}catch(e){fallback()}
      function fallback(){note.innerHTML='Copying is blocked here. Select the text below.<pre style="white-space:pre-wrap;font:inherit;margin:8px 0 0">'+esc(text)+'</pre>'}
    });
    document.getElementById("send").addEventListener("click",function(){var f=document.getElementById("f-summary");if(f){f.value=text;document.getElementById("summary-row").hidden=false}var c=document.getElementById("contact");if(c)c.scrollIntoView();var n=document.getElementById("f-name");if(n)n.focus({preventScroll:true})});
    document.getElementById("again").addEventListener("click",function(){a={};pos=0;renderQ()});
  }
  window.__check={decide:decide,flags:flags};
  renderQ();
})();
