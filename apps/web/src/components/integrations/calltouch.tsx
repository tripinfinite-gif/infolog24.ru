import Script from "next/script";

export function Calltouch() {
  const modId = process.env.NEXT_PUBLIC_CALLTOUCH_MOD_ID;
  if (!modId) return null;

  return (
    <Script id="calltouch" strategy="lazyOnload">
      {`
        (function(w,d,n,c){w.CalltouchDataObject=n;w[n]=function(){w[n]["callbacks"].push(arguments)};
        if(!w[n]["callbacks"]){w[n]["callbacks"]=[]}w[n]["loaded"]=false;
        if(typeof c!=="object"){c=[c]}w[n]["counters"]=c;
        for(var i=0;i<c.length;i++){if(!c[i].func){c[i].func=function(){var x=w[n]["callbacks"];return function(){x.push(arguments)}}()}}
        var l=d.createElement("script");l.type="text/javascript";l.async=true;
        l.src="https://mod.calltouch.ru/init.js?id="+c[0].id;
        var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(l,s);
        })(window,document,"ct","${modId}");
      `}
    </Script>
  );
}
