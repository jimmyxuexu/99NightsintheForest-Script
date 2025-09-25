// 脚本数据
const scriptsData = [
    {
        id: 'teleport-campfire',
        title: '传送到营火',
        category: 'teleport',
        description: '瞬间传送到营火位置，方便快速回到安全区域',
        code: `-- 传送到营火
LocalPlayer.Character:PivotTo(CFrame.new(0, 10, 0))`
    },
    {
        id: 'teleport-grinder',
        title: '传送到磨坊',
        category: 'teleport',
        description: '传送到磨坊位置，用于处理物品',
        code: `-- 传送到磨坊
LocalPlayer.Character:PivotTo(CFrame.new(16.1,4,-4.6))`
    },
    {
        id: 'item-esp',
        title: '物品ESP',
        category: 'esp',
        description: '显示所有可传送物品的位置和名称',
        code: `-- 物品ESP功能
local function createESP(item)
    local adorneePart
    if item:IsA("Model") then
        if item:FindFirstChildWhichIsA("Humanoid") then return end
        adorneePart = item:FindFirstChildWhichIsA("BasePart")
    elseif item:IsA("BasePart") then
        adorneePart = item
    else
        return
    end

    if not adorneePart then return end

    if not item:FindFirstChild("ESP_Billboard") then
        local billboard = Instance.new("BillboardGui")
        billboard.Name = "ESP_Billboard"
        billboard.Adornee = adorneePart
        billboard.Size = UDim2.new(0, 50, 0, 20)
        billboard.AlwaysOnTop = true
        billboard.StudsOffset = Vector3.new(0, 2, 0)

        local label = Instance.new("TextLabel", billboard)
        label.Size = UDim2.new(1, 0, 1, 0)
        label.Text = item.Name
        label.BackgroundTransparency = 1
        label.TextColor3 = Color3.fromRGB(255, 255, 255)
        label.TextStrokeTransparency = 0
        label.TextScaled = true
        billboard.Parent = item
    end
end`
    },
    {
        id: 'npc-esp',
        title: 'NPC ESP',
        category: 'esp',
        description: '显示NPC位置和名称，方便识别敌人',
        code: `-- NPC ESP功能
local npcBoxes = {}

local function createNPCESP(npc)
    if not npc:IsA("Model") or npc:FindFirstChild("HumanoidRootPart") == nil then return end

    local root = npc:FindFirstChild("HumanoidRootPart")
    if npcBoxes[npc] then return end

    local box = Drawing.new("Square")
    box.Thickness = 2
    box.Transparency = 1
    box.Color = Color3.fromRGB(255, 85, 0)
    box.Filled = false
    box.Visible = true

    local nameText = Drawing.new("Text")
    nameText.Text = npc.Name
    nameText.Color = Color3.fromRGB(255, 255, 255)
    nameText.Size = 16
    nameText.Center = true
    nameText.Outline = true
    nameText.Visible = true

    npcBoxes[npc] = {box = box, name = nameText}
end`
    },
    {
        id: 'aimbot',
        title: '自瞄辅助',
        category: 'aimbot',
        description: '右键按住自动瞄准最近的敌人',
        code: `-- 自瞄功能
local AimbotEnabled = false
local FOVRadius = 100
local AimbotTargets = {"Alpha Wolf", "Wolf", "Crossbow Cultist", "Cultist", "Bunny", "Bear", "Polar Bear"}

RunService.RenderStepped:Connect(function()
    if not AimbotEnabled or not UserInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton2) then
        return
    end

    local mousePos = UserInputService:GetMouseLocation()
    local closestTarget, shortestDistance = nil, math.huge

    for _, obj in ipairs(workspace:GetDescendants()) do
        if table.find(AimbotTargets, obj.Name) and obj:IsA("Model") then
            local head = obj:FindFirstChild("Head")
            if head then
                local screenPos, onScreen = camera:WorldToViewportPoint(head.Position)
                if onScreen then
                    local dist = (Vector2.new(screenPos.X, screenPos.Y) - mousePos).Magnitude
                    if dist < shortestDistance and dist <= FOVRadius then
                        shortestDistance = dist
                        closestTarget = head
                    end
                end
            end
        end
    end

    if closestTarget then
        local currentCF = camera.CFrame
        local targetCF = CFrame.new(camera.CFrame.Position, closestTarget.Position)
        camera.CFrame = currentCF:Lerp(targetCF, 0.2)
    end
end)`
    },
    {
        id: 'fly-mode',
        title: '飞行模式',
        category: 'fly',
        description: 'WASD + 空格/Shift 控制飞行，Q键开关',
        code: `-- 飞行功能
local flying, flyConnection = false, nil
local speed = 60

local function startFlying()
    local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end

    local bodyGyro = Instance.new("BodyGyro", hrp)
    local bodyVelocity = Instance.new("BodyVelocity", hrp)
    bodyGyro.P = 9e4
    bodyGyro.MaxTorque = Vector3.new(9e9, 9e9, 9e9)
    bodyGyro.CFrame = hrp.CFrame
    bodyVelocity.MaxForce = Vector3.new(9e9, 9e9, 9e9)

    flyConnection = RunService.RenderStepped:Connect(function()
        local moveVec = Vector3.zero
        local camCF = camera.CFrame
        if UserInputService:IsKeyDown(Enum.KeyCode.W) then moveVec += camCF.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.S) then moveVec -= camCF.LookVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.A) then moveVec -= camCF.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.D) then moveVec += camCF.RightVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.Space) then moveVec += camCF.UpVector end
        if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then moveVec -= camCF.UpVector end
        bodyVelocity.Velocity = moveVec.Magnitude > 0 and moveVec.Unit * speed or Vector3.zero
        bodyGyro.CFrame = camCF
    end)
end

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.Q then
        flying = not flying
        if flying then startFlying() else stopFlying() end
    end
end)`
    },
    {
        id: 'speed-hack',
        title: '速度调整',
        category: 'utility',
        description: '调整角色移动速度',
        code: `-- 速度调整
local currentSpeed = 16

local function setWalkSpeed(speed)
    currentSpeed = speed
    local character = LocalPlayer.Character
    if character and character:FindFirstChildOfClass("Humanoid") then
        character:FindFirstChildOfClass("Humanoid").WalkSpeed = speed
    end
end

-- 设置速度为50
setWalkSpeed(50)`
    },
    {
        id: 'auto-tree-farm',
        title: '自动砍树',
        category: 'farm',
        description: '自动寻找并砍伐小树',
        code: `-- 自动砍树功能
local AutoTreeFarmEnabled = false
local badTrees = {}

task.spawn(function()
    while true do
        if AutoTreeFarmEnabled then
            local trees = {}
            for _, obj in pairs(workspace:GetDescendants()) do
                if obj.Name == "Trunk" and obj.Parent and obj.Parent.Name == "Small Tree" then
                    if not badTrees[obj:GetFullName()] then
                        table.insert(trees, obj)
                    end
                end
            end

            table.sort(trees, function(a, b)
                return (a.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude <
                       (b.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude
            end)

            for _, trunk in ipairs(trees) do
                if not AutoTreeFarmEnabled then break end
                LocalPlayer.Character:PivotTo(trunk.CFrame + Vector3.new(0, 3, 0))
                task.wait(0.2)
                local startTime = tick()
                while AutoTreeFarmEnabled and trunk and trunk.Parent and trunk.Parent.Name == "Small Tree" do
                    mouse1click()
                    task.wait(0.2)
                    if tick() - startTime > 12 then
                        badTrees[trunk:GetFullName()] = true
                        break
                    end
                end
                task.wait(0.3)
            end
        end
        task.wait(1.5)
    end
end)`
    },
    {
        id: 'anti-death',
        title: '防死亡传送',
        category: 'utility',
        description: '检测到危险敌人时自动传送到安全位置',
        code: `-- 防死亡传送
local AntiDeathEnabled = false
local AntiDeathRadius = 50
local AntiDeathTargets = {
    Alien = true,
    ["Alpha Wolf"] = true,
    Wolf = true,
    ["Crossbow Cultist"] = true,
    Cultist = true,
    Bear = true,
}

task.spawn(function()
    while true do
        if AntiDeathEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos = hrp.Position
                for _, npc in ipairs(workspace:GetDescendants()) do
                    if npc:IsA("Model") and npc:FindFirstChild("HumanoidRootPart") and AntiDeathTargets[npc.Name] then
                        local npcPos = npc.HumanoidRootPart.Position
                        if (npcPos - pos).Magnitude <= AntiDeathRadius then
                            LocalPlayer.Character:PivotTo(CFrame.new(0, 10, 0))
                            break
                        end
                    end
                end
            end
        end
        task.wait(0.2)
    end
end)`
    },
    {
        id: 'no-fog',
        title: '清除雾气',
        category: 'utility',
        description: '移除游戏中的雾气效果，获得清晰视野',
        code: `-- 清除雾气
local defaultFogStart = game.Lighting.FogStart
local defaultFogEnd = game.Lighting.FogEnd
local fogEnabled = false

local function toggleFog(state)
    fogEnabled = state
    if fogEnabled then
        game.Lighting.FogStart = 999999
        game.Lighting.FogEnd = 1000000
    else
        game.Lighting.FogStart = defaultFogStart
        game.Lighting.FogEnd = defaultFogEnd
    end
end

-- 启用清除雾气
toggleFog(true)`
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadScripts();
    setupEventListeners();
    setupSmoothScrolling();
}

function loadScripts() {
    const scriptsGrid = document.getElementById('scriptsGrid');
    scriptsGrid.innerHTML = '';

    scriptsData.forEach(script => {
        const scriptCard = createScriptCard(script);
        scriptsGrid.appendChild(scriptCard);
    });
}

function createScriptCard(script) {
    const card = document.createElement('div');
    card.className = 'script-card fade-in';
    card.setAttribute('data-category', script.category);

    card.innerHTML = `
        <div class="script-header">
            <h3 class="script-title">${script.title}</h3>
            <span class="script-category">${getCategoryName(script.category)}</span>
        </div>
        <div class="script-content">
            <p class="script-description">${script.description}</p>
            <div class="script-code">
                <button class="copy-btn" onclick="copyScript('${script.id}')">复制</button>
                <pre><code>${script.code}</code></pre>
            </div>
            <div class="script-actions">
                <button class="action-btn action-btn-primary" onclick="copyScript('${script.id}')">复制脚本</button>
                <button class="action-btn action-btn-secondary" onclick="showScriptInfo('${script.id}')">查看详情</button>
            </div>
        </div>
    `;

    return card;
}

function getCategoryName(category) {
    const categoryNames = {
        'teleport': '传送',
        'esp': 'ESP',
        'aimbot': '自瞄',
        'fly': '飞行',
        'farm': '农场',
        'utility': '工具'
    };
    return categoryNames[category] || category;
}

function copyScript(scriptId) {
    const script = scriptsData.find(s => s.id === scriptId);
    if (script) {
        navigator.clipboard.writeText(script.code).then(() => {
            showToast('脚本已复制到剪贴板！');
        }).catch(() => {
            showToast('复制失败，请手动选择代码复制');
        });
    }
}

function showScriptInfo(scriptId) {
    const script = scriptsData.find(s => s.id === scriptId);
    if (script) {
        alert(`${script.title}\n\n${script.description}\n\n使用方法：复制脚本代码到Roblox执行器中运行`);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // 筛选功能
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', handleFilter);
    });

    // 导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const scriptCards = document.querySelectorAll('.script-card');

    scriptCards.forEach(card => {
        const title = card.querySelector('.script-title').textContent.toLowerCase();
        const description = card.querySelector('.script-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function handleFilter(event) {
    const filter = event.target.getAttribute('data-filter');
    
    // 更新活跃标签
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // 筛选脚本
    const scriptCards = document.querySelectorAll('.script-card');
    scriptCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function handleNavClick(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    // 更新活跃导航链接
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function setupSmoothScrolling() {
    // 添加淡入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}
