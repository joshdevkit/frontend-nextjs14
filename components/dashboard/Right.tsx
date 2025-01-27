export default function Right() {
  return (
    <aside className="w-1/4 bg-neutral-50 dark:bg-neutral-900 p-6 hidden lg:block rounded-r-lg">
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-4">Friend Requests (2)</h2>
        {[1, 2].map((request) => (
          <div
            key={request}
            className="flex items-center justify-between mb-4 bg-neutral-200 dark:bg-neutral-800 py-3 rounded-lg px-3"
          >
            <div className="flex items-center space-x-2">
              <img
                src="https://github.com/shadcn.png"
                className="w-8 h-8 bg-gray-300 rounded-full"
                alt=""
              />
              <p className="text-sm font-medium">Request {request}</p>
            </div>
            <button className="text-sm text-blue-500">Accept</button>
          </div>
        ))}
      </div>
      {/* Online Friends */}
      {/* <div>
        <h2 className="font-bold text-lg mb-4">Online Friends</h2>
        <ul className="space-y-2">
          {[1, 2, 3].map((online) => (
            <li key={online} className="flex items-center space-x-2">
              <img
                src="https://github.com/shadcn.png"
                className="w-8 h-8 bg-green-300 rounded-full"
                alt=""
              />
              <p className="text-sm font-medium">Online User {online}</p>
            </li>
          ))}
        </ul>
      </div> */}
    </aside>
  );
}
