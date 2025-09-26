// 脚本数据
const scriptsData = [
    {
        id: 'teleport-campfire',
        title: 'Teleport to Campfire',
        category: 'teleport',
        description: 'Instantly teleport to campfire location for quick return to safe area',
        code: `LocalPlayer.Character:PivotTo(CFrame.new(0, 10, 0))`
    },
    {
        id: 'teleport-grinder',
        title: 'Teleport to Mill',
        category: 'teleport',
        description: 'Teleport to mill location for item processing',
        code: `LocalPlayer.Character:PivotTo(CFrame.new(16.1,4,-4.6))`
    },
    {
        id: 'item-esp',
        title: 'Item ESP',
        category: 'esp',
        description: 'Shows location and name of all teleportable items',
        code: `local function createESP(item)
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
        description: 'Shows NPC location and name for easy enemy identification',
        code: `local npcBoxes = {}

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
        title: 'Aimbot Assistant',
        category: 'aimbot',
        description: 'Right-click and hold to automatically aim at nearest enemy',
        code: `local AimbotEnabled = false
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
        title: 'Fly Mode',
        category: 'fly',
        description: 'WASD + Space/Shift to control flight, Q key to toggle',
        code: `local flying, flyConnection = false, nil
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
        title: 'Speed Adjustment',
        category: 'utility',
        description: 'Adjust character movement speed',
        code: `local currentSpeed = 16

local function setWalkSpeed(speed)
    currentSpeed = speed
    local character = LocalPlayer.Character
    if character and character:FindFirstChildOfClass("Humanoid") then
        character:FindFirstChildOfClass("Humanoid").WalkSpeed = speed
    end
end

setWalkSpeed(50)`
    },
    {
        id: 'auto-tree-farm',
        title: 'Auto Tree Farm',
        category: 'farm',
        description: 'Automatically find and chop small trees',
        code: `local AutoTreeFarmEnabled = false
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
        title: 'Anti-Death Teleport',
        category: 'utility',
        description: 'Automatically teleport to safe location when dangerous enemies are detected',
        code: `local AntiDeathEnabled = false
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
        title: 'Remove Fog',
        category: 'utility',
        description: 'Remove fog effects in the game for clear vision',
        code: `local defaultFogStart = game.Lighting.FogStart
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

toggleFog(true)`
    },
    {
        id: 'kill-aura',
        title: 'Kill Aura',
        category: 'combat',
        description: 'Automatically attack nearby enemies within range',
        code: `local KillAuraEnabled = false
local KillAuraRadius = 50
local AimbotTargets = {"Alien", "Alpha Wolf", "Wolf", "Crossbow Cultist", "Cultist", "Bunny", "Bear", "Polar Bear"}

task.spawn(function()
    while true do
        if KillAuraEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos = hrp.Position
                for _, npc in ipairs(workspace:GetDescendants()) do
                    if npc:IsA("Model") and npc:FindFirstChild("HumanoidRootPart") and table.find(AimbotTargets, npc.Name) then
                        local npcPos = npc.HumanoidRootPart.Position
                        if (npcPos - pos).Magnitude <= KillAuraRadius then
                            mouse1click()
                            break
                        end
                    end
                end
            end
        end
        task.wait(0.1)
    end
end)`
    },
    {
        id: 'auto-collect',
        title: 'Auto Collect Items',
        category: 'farm',
        description: 'Automatically collect nearby items and resources',
        code: `local AutoCollectEnabled = false
local teleportTargets = {"Apple", "Bandage", "Berry", "Cake", "Carrot", "Chilli", "Coal", "Deer", "Fuel Canister", "Log", "Medkit", "Morsel", "Steak"}

task.spawn(function()
    while true do
        if AutoCollectEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos = hrp.Position
                for _, item in ipairs(workspace:GetDescendants()) do
                    if table.find(teleportTargets, item.Name) and item:IsA("Model") then
                        local itemPos = item:FindFirstChildWhichIsA("BasePart")
                        if itemPos and (itemPos.Position - pos).Magnitude <= 100 then
                            LocalPlayer.Character:PivotTo(itemPos.CFrame + Vector3.new(0, 2, 0))
                            task.wait(0.5)
                            pressKey("F")
                            task.wait(0.2)
                            pressKey("E")
                            task.wait(0.5)
                        end
                    end
                end
            end
        end
        task.wait(1)
    end
end)`
    },
    {
        id: 'chest-esp',
        title: 'Chest ESP',
        category: 'esp',
        description: 'Highlight chests and valuable containers with golden glow',
        code: `local ChestESPEnabled = false

local function createChestESP(chest)
    local adorneePart = chest:FindFirstChildWhichIsA("BasePart")
    if not adorneePart then return end

    if not chest:FindFirstChild("ChestESP_Billboard") then
        local billboard = Instance.new("BillboardGui")
        billboard.Name = "ChestESP_Billboard"
        billboard.Adornee = adorneePart
        billboard.Size = UDim2.new(0, 100, 0, 30)
        billboard.AlwaysOnTop = true
        billboard.StudsOffset = Vector3.new(0, 3, 0)

        local label = Instance.new("TextLabel", billboard)
        label.Size = UDim2.new(1, 0, 1, 0)
        label.Text = "💎 CHEST 💎"
        label.BackgroundTransparency = 1
        label.TextColor3 = Color3.fromRGB(255, 215, 0)
        label.TextStrokeTransparency = 0
        label.TextScaled = true
        billboard.Parent = chest
    end

    if not chest:FindFirstChild("ChestESP_Highlight") then
        local highlight = Instance.new("Highlight")
        highlight.Name = "ChestESP_Highlight"
        highlight.FillColor = Color3.fromRGB(255, 215, 0)
        highlight.OutlineColor = Color3.fromRGB(255, 165, 0)
        highlight.FillTransparency = 0.3
        highlight.OutlineTransparency = 0
        highlight.Adornee = chest:IsA("Model") and chest or adorneePart
        highlight.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
        highlight.Parent = chest
    end
end`
    },
    {
        id: 'auto-cook',
        title: 'Auto Cook',
        category: 'survival',
        description: 'Automatically use cooking stations to prepare food',
        code: `local AutoCookEnabled = false

task.spawn(function()
    while true do
        if AutoCookEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                for _, obj in ipairs(workspace:GetDescendants()) do
                    if obj.Name == "Cooking Station" or obj.Name == "Campfire" then
                        local objPos = obj:FindFirstChildWhichIsA("BasePart")
                        if objPos and (objPos.Position - hrp.Position).Magnitude <= 200 then
                            LocalPlayer.Character:PivotTo(objPos.CFrame + Vector3.new(0, 2, 0))
                            task.wait(0.5)
                            pressKey("F")
                            task.wait(2)
                        end
                    end
                end
            end
        end
        task.wait(5)
    end
end)`
    },
    {
        id: 'inf-hunger',
        title: 'Inf Hunger',
        category: 'survival',
        description: 'Maintain maximum health and hunger levels',
        code: `local InfHungerEnabled = false

task.spawn(function()
    while true do
        if InfHungerEnabled then
            local character = LocalPlayer.Character
            if character then
                local humanoid = character:FindFirstChildOfClass("Humanoid")
                if humanoid then
                    humanoid.Health = math.max(humanoid.Health, 100)
                end
            end
        end
        task.wait(0.1)
    end
end)`
    },
    {
        id: 'inf-stamina',
        title: 'Inf Stamina',
        category: 'survival',
        description: 'Maintain maximum stamina and movement speed',
        code: `local InfStaminaEnabled = false

task.spawn(function()
    while true do
        if InfStaminaEnabled then
            local character = LocalPlayer.Character
            if character then
                local humanoid = character:FindFirstChildOfClass("Humanoid")
                if humanoid then
                    humanoid.WalkSpeed = math.max(humanoid.WalkSpeed, 50)
                end
            end
        end
        task.wait(0.1)
    end
end)`
    },
    {
        id: 'hitbox-extender',
        title: 'Hitbox Extender',
        category: 'combat',
        description: 'Expand enemy hitboxes for easier targeting',
        code: `local HitboxExtenderEnabled = false
local HitboxMultiplier = 2
local AimbotTargets = {"Alien", "Alpha Wolf", "Wolf", "Crossbow Cultist", "Cultist", "Bunny", "Bear", "Polar Bear"}

task.spawn(function()
    while true do
        if HitboxExtenderEnabled then
            for _, npc in ipairs(workspace:GetDescendants()) do
                if npc:IsA("Model") and npc:FindFirstChild("HumanoidRootPart") and table.find(AimbotTargets, npc.Name) then
                    local hrp = npc.HumanoidRootPart
                    if hrp then
                        local currentSize = hrp.Size
                        hrp.Size = currentSize * HitboxMultiplier
                    end
                end
            end
        end
        task.wait(0.1)
    end
end)`
    },
    {
        id: 'auto-win',
        title: 'Auto Win',
        category: 'utility',
        description: 'Automatically complete game objectives and win conditions',
        code: `local AutoWinEnabled = false

task.spawn(function()
    while true do
        if AutoWinEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                for _, location in ipairs({"Campfire", "Grinder", "Stronghold Diamond Chest"}) do
                    for _, obj in ipairs(workspace:GetDescendants()) do
                        if obj.Name == location then
                            local objPos = obj:FindFirstChildWhichIsA("BasePart")
                            if objPos and (objPos.Position - hrp.Position).Magnitude <= 500 then
                                LocalPlayer.Character:PivotTo(objPos.CFrame + Vector3.new(0, 2, 0))
                                task.wait(1)
                                pressKey("F")
                                task.wait(0.5)
                                pressKey("E")
                                task.wait(1)
                            end
                        end
                    end
                end
            end
        end
        task.wait(5)
    end
end)`
    },
    {
        id: 'teleport-players',
        title: 'Teleport to Players',
        category: 'teleport',
        description: 'Teleport to other players in the game',
        code: `local TeleportToPlayersEnabled = false

task.spawn(function()
    while true do
        if TeleportToPlayersEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                for _, player in ipairs(Players:GetPlayers()) do
                    if player ~= LocalPlayer and player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
                        local playerPos = player.Character.HumanoidRootPart.Position
                        if (playerPos - hrp.Position).Magnitude <= 1000 then
                            LocalPlayer.Character:PivotTo(playerPos + Vector3.new(0, 5, 0))
                            task.wait(2)
                        end
                    end
                end
            end
        end
        task.wait(3)
    end
end)`
    },
    {
        id: 'auto-farm-all',
        title: 'Auto Farm All Items',
        category: 'farm',
        description: 'Automatically collect all types of items and resources',
        code: `local AutoFarmAllEnabled = false
local teleportTargets = {"Alien", "Alien Chest", "Alpha Wolf", "Apple", "Bandage", "Bear", "Berry", "Bunny", "Cake", "Carrot", "Chest", "Chilli", "Coal", "Deer", "Fuel Canister", "Log", "Medkit", "Morsel", "Steak", "Wolf"}

task.spawn(function()
    while true do
        if AutoFarmAllEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                for _, itemName in ipairs(teleportTargets) do
                    for _, obj in ipairs(workspace:GetDescendants()) do
                        if obj.Name == itemName and obj:IsA("Model") then
                            local objPos = obj:FindFirstChildWhichIsA("BasePart")
                            if objPos and (objPos.Position - hrp.Position).Magnitude <= 200 then
                                LocalPlayer.Character:PivotTo(objPos.CFrame + Vector3.new(0, 2, 0))
                                task.wait(0.5)
                                pressKey("F")
                                task.wait(0.2)
                                pressKey("E")
                                task.wait(0.5)
                                break
                            end
                        end
                    end
                end
            end
        end
        task.wait(2)
    end
end)`
    },
    {
        id: 'bring-items',
        title: 'Bring Items',
        category: 'farm',
        description: 'Teleport items directly to your location',
        code: `local BringItemsEnabled = false
local teleportTargets = {"Apple", "Bandage", "Berry", "Cake", "Carrot", "Chilli", "Coal", "Deer", "Fuel Canister", "Log", "Medkit", "Morsel", "Steak"}

task.spawn(function()
    while true do
        if BringItemsEnabled then
            local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos = hrp.Position
                for _, item in ipairs(workspace:GetDescendants()) do
                    if table.find(teleportTargets, item.Name) and item:IsA("Model") then
                        local itemPos = item:FindFirstChildWhichIsA("BasePart")
                        if itemPos and (itemPos.Position - pos).Magnitude <= 100 then
                            LocalPlayer.Character:PivotTo(itemPos.CFrame + Vector3.new(0, 2, 0))
                            task.wait(0.5)
                            pressKey("F")
                            task.wait(0.2)
                            pressKey("E")
                            task.wait(0.5)
                        end
                    end
                end
            end
        end
        task.wait(1)
    end
end)`
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
                <button class="copy-btn" onclick="copyScript('${script.id}')">Copy</button>
                <pre><code>${script.code}</code></pre>
            </div>
            <div class="script-actions">
                <button class="action-btn action-btn-primary" onclick="copyScript('${script.id}')">Copy Script</button>
                <button class="action-btn action-btn-secondary" onclick="showScriptInfo('${script.id}')">View Details</button>
            </div>
        </div>
    `;

    return card;
}

function getCategoryName(category) {
    const categoryNames = {
        'teleport': 'Teleport',
        'esp': 'ESP',
        'aimbot': 'Aimbot',
        'fly': 'Fly',
        'farm': 'Farm',
        'utility': 'Utility',
        'combat': 'Combat',
        'survival': 'Survival'
    };
    return categoryNames[category] || category;
}

function copyScript(scriptId) {
    const script = scriptsData.find(s => s.id === scriptId);
    if (script) {
        // 清理代码，移除中文注释和标题
        let cleanCode = script.code
            .replace(/--.*[\u4e00-\u9fff].*/g, '') // 移除中文注释
            .replace(/^[\s\n]*--.*[\u4e00-\u9fff].*$/gm, '') // 移除多行中文注释
            .replace(/^\s*--.*[\u4e00-\u9fff].*$/gm, '') // 移除行首中文注释
            .trim();
        
        navigator.clipboard.writeText(cleanCode).then(() => {
            showToast('Script copied to clipboard!');
        }).catch(() => {
            showToast('Copy failed, please manually select and copy the code');
        });
    }
}

function showScriptInfo(scriptId) {
    const script = scriptsData.find(s => s.id === scriptId);
    if (script) {
        alert(`${script.title}\n\n${script.description}\n\nUsage: Copy script code to Roblox executor and run`);
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

    // FAQ功能
    setupFAQ();
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

    // 添加滚动监听，自动更新导航栏活跃状态
    setupScrollSpy();
}

function setupScrollSpy() {
    const sections = ['home', 'scripts', 'features', 'about', 'faq'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = section;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 关闭所有其他FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前FAQ项
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}
