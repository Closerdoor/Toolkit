export function AboutPage() {
  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Why ToolKit exists</p>
          <h1>关于 ToolKit</h1>
          <p className="lede">
            ToolKit 是一个自用优先的工具集合。它的目标不是做一个庞大的商业工具站，而是把我和朋友们经常需要的小工具放在一个稳定、干净、好找的地方。
          </p>
        </div>
      </section>

      <div className="two-col">
        <section className="about-block">
          <h2>创作初心</h2>
          <p className="lede">
            每次需要 JSON 格式化、正则测试、二维码生成或其他小工具时，都要重新搜索、打开、试错，还经常遇到体验很差的页面。ToolKit 想解决的就是这点摩擦。
          </p>
        </section>
        <section className="about-block">
          <h2>设计原则</h2>
          <p className="lede">首版工具尽量在浏览器本地处理，不上传输入内容；页面保持克制、清晰、可搜索；每个工具都有独立 URL，方便收藏和分享。</p>
        </section>
      </div>
    </main>
  )
}
